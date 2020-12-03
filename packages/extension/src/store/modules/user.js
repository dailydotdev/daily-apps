import { isToday } from 'date-fns';
import { authService } from '../../common/services';
import { setCache, ANALYTICS_ID_KEY } from '../../common/cache';

const updateAnalyticsUser = id => setCache(ANALYTICS_ID_KEY, id);

const initialState = () => ({
  profile: null,
  readingRank: {
    rank: 0,
    progress: 0,
    shownProgress: 0,
  },
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
      state.lastRead = now;
      state.readingRank.progress += 1;
    },
    updateShownProgress(state) {
      state.readingRank.shownProgress = state.readingRank.progress;
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
        commit('incrementReadingProgress');
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
  },
};
