import { isToday, startOfToday, isThisISOWeek } from 'date-fns';
import { apolloClient } from '../../apollo';
import { authService } from '../../common/services';
import { setCache, ANALYTICS_ID_KEY } from '../../common/cache';
import { USER_READING_RANK_QUERY } from '../../graphql/home';
import {STEPS_PER_RANK} from "@daily/components/src/common/rank";

const updateAnalyticsUser = id => setCache(ANALYTICS_ID_KEY, id);

const initialState = () => ({
  profile: null,
  readingRank: {
    rank: 0,
    progress: 0,
    shownProgress: 0,
    nextRank: 0,
  },
  readingRankLevelUp: false,
  lastRead: null,
});

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setProfile(state, profile) {
      state.profile = profile;
    },
    confirmNewUser(state) {
      state.profile = { ...state.profile, newUser: false };
    },
    reset(state) {
      const defaultState = initialState();
      state.profile = null;
      state.readingRank = defaultState.readingRank;
      state.lastRead = null;
    },
    incrementReadingProgress(state, now = new Date()) {
      const maxProgress = STEPS_PER_RANK[STEPS_PER_RANK.length - 1];
      const { progress } = state.readingRank;
      state.lastRead = now;
      if ((!!state.profile || progress < STEPS_PER_RANK[state.readingRank.rank]) && progress < maxProgress) {
        state.readingRank.progress += 1;
        if (state.readingRank.progress >= STEPS_PER_RANK[state.readingRank.rank]) {
          state.readingRank.nextRank = state.readingRank.rank + 1;
          state.readingRankLevelUp = true;
        }
      }
    },
    updateShownProgress(state) {
      if (state.readingRankLevelUp) {
        return;
      }
      state.readingRank.shownProgress = state.readingRank.progress;
    },
    updateReadingRank(state, { rank, progress }) {
      if (rank > state.readingRank.rank) {
        state.readingRankLevelUp = true;
        state.readingRank.nextRank = rank;
      } else {
        state.readingRank.rank = rank;
      }
      state.readingRank.progress = progress;
    },
    setLastReadToToday(state) {
      state.lastRead = startOfToday();
    },
    confirmedRankLevelUp(state) {
      state.readingRankLevelUp = false;
      state.readingRank.shownProgress = state.readingRank.progress;
      if (!!state.profile) {
        state.readingRank.rank = state.readingRank.nextRank;
      }
    },
  },
  getters: {
    isLoggedIn(state) {
      return !!state.profile;
    },
    isPremium(state) {
      return !!state.profile && !!state.profile.premium;
    },
  },
  actions: {
    async login({ commit, state }, profile) {
      if (!state.profile || state.profile.id !== profile.id) {
        await updateAnalyticsUser(profile.id);
      }
      commit('setProfile', profile);
    },

    async logout({ commit, dispatch }) {
      // TODO: handle error
      await authService.logout();
      commit('reset');
      await Promise.all([
        dispatch('ui/reset', null, { root: true }),
        dispatch('feed/reset', null, { root: true }),
        authService.getUserProfile().then(profile => updateAnalyticsUser(profile.id)),
      ]);
      if ('reload' in window.location) {
        window.location.reload();
      }
    },

    async validateAuth({ commit, dispatch, state }) {
      const profile = await authService.getUserProfile();
      if (profile.providers) {
        if (!profile.infoConfirmed) {
          const redirectUri = browser.extension.getURL('index.html');
          window.location.href = `${profile.registrationLink}?redirect_uri=${encodeURI(redirectUri)}`;
          return;
        }
        if (state.profile && state.profile.id === profile.id) {
          // Keep newUser true according multiple sessions until confirmed
          commit('setProfile', Object.assign({}, profile, { newUser: state.profile && state.profile.newUser }));
        } else {
          await dispatch('login', profile);
        }
      } else if (state.profile) {
        await dispatch('logout');
      }
    },

    async updateRankProgress({ commit, state, dispatch }) {
      if (!state.lastRead || !isToday(state.lastRead)) {
        await dispatch('checkWeeklyReadingRankReset');
        commit('incrementReadingProgress');
        // slight delay so the user won't miss it
        setTimeout(() => dispatch('updateShownProgress'), 100);
      }
    },

    async updateShownProgress({ commit, dispatch }) {
      if (document.visibilityState === 'hidden') {
        document.addEventListener('visibilitychange', () => setTimeout(() => dispatch('updateShownProgress'), 1000), { once: true });
      } else {
        commit('updateShownProgress');
      }
    },

    async fetchReadingRank({ commit, dispatch, state }) {
      if (state.profile) {
        const res = await apolloClient.query({
          query: USER_READING_RANK_QUERY,
          variables: { id: state.profile.id },
          fetchPolicy: 'no-cache',
        });
        commit('updateReadingRank', { rank: res.data.userReadingRank.currentRank, progress: res.data.userReadingRank.progressThisWeek });
        if (res.data.userReadingRank.readToday) {
          commit('setLastReadToToday');
        }
        if (state.readingRank.progress < state.readingRank.shownProgress) {
          await dispatch('updateShownProgress');
        } else {
          // Let the rank update and then show progress animation, slight delay so the user won't miss it
          setTimeout(() => dispatch('updateShownProgress'), 1000);
        }
      }
    },

    async checkWeeklyReadingRankReset({ commit, dispatch, state }) {
      if (!state.profile && state.readingRank.progress > 0 && !isThisISOWeek(state.lastRead)) {
        commit('updateReadingRank', { rank: 0, progress: 0 });
        await dispatch('updateShownProgress');
      }
    }
  },
};
