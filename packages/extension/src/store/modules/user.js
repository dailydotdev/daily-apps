import { authService } from '../../common/services';
import { setCache, ANALYTICS_ID_KEY } from '../../common/cache';

const updateAnalyticsUser = id => setCache(ANALYTICS_ID_KEY, id);

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
    confirmNewUser(state) {
      state.profile = { ...state.profile, newUser: false };
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
  },
};
