import { authService } from '../../common/services';

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
  },
  getters: {
    isLoggedIn(state) {
      return !!state.profile;
    },
  },
  actions: {
    async authenticate({ commit, state }, { code }) {
      const profile = await authService.authenticate(code, state.challenge.verifier);
      commit('setProfile', profile);
    },
    async validateAuth({ commit }) {
      const profile = await authService.getUserProfile();
      if (profile.providers) {
        commit('setProfile', profile);
      } else {
        commit('setProfile', null);
      }
    },
  },
};
