import Vue from 'vue';
import Vuex from 'vuex';
import cache from './plugins/cache';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    initialized: false,
  },
  plugins: [cache],
  mutations: {
    loadFromCache(state, cached) {
      if (cached) {
        Object.keys(cached).forEach((key) => {
          state[key] = { ...state[key], ...cached[key] };
        });
      }

      state.initialized = true;
    },
  },
});
