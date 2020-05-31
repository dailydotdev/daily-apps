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
    async authenticate({ commit, state }, { code }) {
      const profile = await authService.authenticate(code, state.challenge.verifier);
      commit('setProfile', profile);
    },
    async generateChallenge({ commit }) {
      const challenge = await authService.generateChallenge();
      commit('setChallenge', challenge);
    },
  },
};
