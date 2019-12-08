import { authService, contentService } from '../../common/services';
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
  },
  actions: {
    async authenticate({ commit, state }, { provider, code }) {
      try {
        const profile = await authService.authenticate(code, state.challenge.verifier);
        contentService.setIsLoggedIn(true);

        ga('send', 'event', 'Login', 'Done', provider);
        await updateAnalyticsUser(profile.id);

        commit('setProfile', profile);
      } catch {
        // TODO: handle error
        ga('send', 'event', 'Login', 'Failed', provider);
      }
    },

    async logout({ commit, dispatch }) {
      // TODO: handle error
      contentService.setIsLoggedIn(false);
      commit('setProfile', null);
      await authService.logout();
      await Promise.all([
        dispatch('ui/reset', null, { root: true }),
        dispatch('feed/reset', null, { root: true }),
        authService.getUserProfile().then(profile => updateAnalyticsUser(profile.id)),
      ]);
    },

    async generateChallenge({ commit }) {
      const challenge = await authService.generateChallenge();
      commit('setChallenge', challenge);
    },

    async validateAuth({ commit, state, dispatch }) {
      if (state.profile) {
        const profile = await authService.getUserProfile();
        if (profile.providers) {
          commit('setProfile', profile);
        } else {
          dispatch('logout');
        }
      }
    },
  },
};
