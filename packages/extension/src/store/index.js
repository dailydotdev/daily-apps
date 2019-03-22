import Vue from 'vue';
import Vuex from 'vuex';

import cache from './plugins/cache';
import sync from './plugins/sync';

import ui from './modules/ui';
import feed from './modules/feed';
import user from './modules/user';
import { contentService, profileService } from '../common/services';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    initialized: false,
  },
  modules: { ui, feed, user },
  plugins: [cache, sync],
  mutations: {
    loadFromCache(state, cached) {
      if (cached) {
        Object.keys(cached).forEach((key) => {
          state[key] = Object.assign({}, state[key], cached[key]);
        });

        if (cached.ui && cached.ui.lastNotificationTime) {
          state.ui.lastNotificationTime = new Date(cached.ui.lastNotificationTime);
        }

        if (cached.feed && cached.feed.latest) {
          state.feed.latest = new Date(cached.feed.latest);
        }

        if (cached.user && cached.user.profile && cached.user.profile.expiresIn) {
          state.user.profile.expiresIn = new Date(cached.user.profile.expiresIn);
        }
      }

      if (state.user.profile) {
        profileService.setAccessToken(state.user.profile.accessToken);
        contentService.setAccessToken(state.user.profile.accessToken);
      }

      state.initialized = true;
    },
  },
});
