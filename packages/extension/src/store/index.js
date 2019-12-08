import Vue from 'vue';
import Vuex from 'vuex';

import cache from './plugins/cache';
import sync from './plugins/sync';

import ui from './modules/ui';
import feed from './modules/feed';
import user from './modules/user';
import { contentService } from '../common/services';

Vue.use(Vuex);

const cache2Time = time => (time ? new Date(time) : null);

const cache2Post = p => ({
  ...p,
  createdAt: cache2Time(p.createdAt),
  publishedAt: cache2Time(p.publishedAt),
});

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
          state[key] = { ...state[key], ...cached[key] };
        });

        if (cached.ui) {
          state.ui.lastNotificationTime = cache2Time(cached.ui.lastNotificationTime);
        }

        if (cached.feed) {
          state.feed.latest = cache2Time(cached.feed.latest);
          state.feed.posts = (cached.feed.posts || []).map(cache2Post);
          state.feed.bookmarks = (cached.feed.bookmarks || []).map(cache2Post);
        }

        if (cached.user && cached.user.profile) {
          state.user.profile.expiresIn = cache2Time(cached.user.profile.expiresIn);
        }
      }

      if (state.user.profile) {
        contentService.setIsLoggedIn(true);
      }

      state.initialized = true;
    },
  },
});
