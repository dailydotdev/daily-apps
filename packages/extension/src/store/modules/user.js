import mixpanel from 'mixpanel-browser';
import { authService, profileService, contentService } from '../../common/services';
import { setCache, ANALYTICS_ID_KEY } from '../../common/cache';

const updateAnalyticsUser = (id) => {
  ga('set', 'userId', id);
  mixpanel.identify(id);
  return setCache(ANALYTICS_ID_KEY, id);
};

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
      try {
        const profile = await authService.authenticate(provider, code);

        profileService.setAccessToken(profile.accessToken);
        contentService.setAccessToken(profile.accessToken);

        ga('send', 'event', 'Login', 'Done', provider);
        mixpanel.track('Login Done', { provider, newUser: profile.newUser });
        await updateAnalyticsUser(profile.id);

        commit('setProfile', profile);
        return profile;
      } catch {
        // TODO: handle error
        ga('send', 'event', 'Login', 'Failed', provider);
        mixpanel.track('Login Failed', { provider });
      }

      return null;
    },

    async logout({ commit, dispatch }) {
      // TODO: handle error
      profileService.clearAccessToken();
      contentService.clearAccessToken();
      commit('setProfile', null);
      await authService.logout();
      await Promise.all([
        dispatch('ui/reset', null, { root: true }),
        dispatch('feed/reset', null, { root: true }),
        authService.getUserId().then(updateAnalyticsUser),
      ]);
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
