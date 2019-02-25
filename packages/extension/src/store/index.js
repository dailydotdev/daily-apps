import Vue from 'vue';
import Vuex from 'vuex';

import cache from './plugins/cache';

import ui from './modules/ui';
import feed from './modules/feed';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    initialized: false,
  },
  modules: { ui, feed },
  plugins: [cache],
  mutations: {
    loadFromCache(state, cached) {
      if (cached) {
        Object.keys(cached).forEach((key) => {
          state[key] = Object.assign({}, state[key], cached[key]);
        });
      }

      state.initialized = true;
    },
  },
});
