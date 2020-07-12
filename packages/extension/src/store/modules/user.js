import { authService } from '../../common/services';
import { setCache, ANALYTICS_ID_KEY } from '../../common/cache';

const updateAnalyticsUser = (id) => {
  ga('set', 'userId', id);
  return setCache(ANALYTICS_ID_KEY, id);
};

const initialState = () => ({
  profile: null,
  challenge: null,
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
    setChallenge(state, challenge) {
      state.challenge = challenge;
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

    async authenticate({ commit, state, dispatch }, { provider, code }) {
      try {
        const profile = await authService.authenticate(code, state.challenge.verifier);
        ga('send', 'event', 'Login', 'Done', provider);

        if (!profile.newUser) {
          commit('feed/checkBookmarksConflicts', null, { root: true });
        }
        await dispatch('login', profile);
      } catch (err) {
        // TODO: handle error
        ga('send', 'event', 'Login', 'Failed', provider);
      }
    },

    async logout({ commit, dispatch }) {
      // TODO: handle error
      await authService.logout();
      commit('setProfile', null);
      await Promise.all([
        dispatch('ui/reset', null, { root: true }),
        dispatch('feed/reset', null, { root: true }),
        authService.getUserProfile().then(profile => updateAnalyticsUser(profile.id)),
      ]);
      if ('reload' in window.location) {
        window.location.reload();
      }
    },

    async generateChallenge({ commit }) {
      const challenge = await authService.generateChallenge();
      commit('setChallenge', challenge);
    },

    async validateAuth({ commit, dispatch, state }) {
      const profile = await authService.getUserProfile();
      if (profile.providers) {
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

    async updateProfile({ commit, state }, newProfile) {
      await authService.updateUserProfile(newProfile);
      commit('setProfile', Object.assign({}, state.profile, newProfile, { infoConfirmed: true }));
    },
  },
};
