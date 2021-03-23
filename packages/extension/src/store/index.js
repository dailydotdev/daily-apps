import Vue from 'vue';
import Vuex from 'vuex';

import cache from './plugins/cache';
import sync from './plugins/sync';

import ui from './modules/ui';
import feed from './modules/feed';
import user from './modules/user';

Vue.use(Vuex);

const cache2Time = time => ((time || time === 0) ? new Date(time) : null);

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

        if (cached.user) {
          if (cached.user.lastRead) {
            state.user.lastRead = cache2Time(cached.user.lastRead);
          }
        }

        if (cached.ui) {
          state.ui.lastNotificationTime = cache2Time(cached.ui.lastNotificationTime);
          if (cached.ui.lastBannerSeen !== undefined) {
            state.ui.lastBannerSeen = cache2Time(cached.ui.lastBannerSeen);
          }
          if (cached.ui.lastGreeting !== undefined) {
            state.ui.lastGreeting = cache2Time(cached.ui.lastGreeting);
          }
        }

        if (cached.feed) {
          state.feed.latest = cache2Time(cached.feed.latest);
          state.feed.posts = (cached.feed.posts || []).map(cache2Post);
          state.feed.bookmarks = (cached.feed.bookmarks || []).map(cache2Post);
          state.feed.conflictBookmarks = (cached.feed.conflictBookmarks || []).map(cache2Post);
          if (cached.feed.publications) {
            delete state.feed.publications;
            state.feed.disabledPublications = cached.feed.publications.reduce((acc, val) => {
              if (!val.enabled) {
                return { ...acc, [val.id]: true };
              }
              return acc;
            }, {});
          }
          if (cached.feed.tags) {
            delete state.feed.tags;
            state.feed.enabledTags = cached.feed.tags.reduce((acc, val) => {
              if (!val.enabled) {
                return { ...acc, [val.name]: true };
              }
              return acc;
            }, {});
          }
        }
      }
      state.initialized = true;
    },
  },
});
