import { authService, contentService } from '../../common/services';

const initialState = () => ({
  profile: null,
});

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setProfile(state, profile) {
      state.profile = profile;
    },
    updateToken(state, newToken) {
      state.profile = { ...state.profile, ...newToken };
    },
  },
  getters: {
    isLoggedIn(state) {
      return !!state.profile;
    },
  },
  actions: {
    async authenticate({ commit }, { provider, code }) {
      const profile = await authService.authenticate(provider, code);
      contentService.setAccessToken(profile.accessToken);
      commit('setProfile', profile);
    },

    async refreshToken({ commit, state }) {
      if (state.profile) {
        const dt = state.profile.expiresIn - new Date();
        if (dt <= 60 * 60 * 1000) {
          const token = await authService.refreshToken(state.profile.refreshToken);
          commit('updateToken', { accessToken: token.token, expiresIn: token.expiresIn });
        }
      }
    },
  },
};
