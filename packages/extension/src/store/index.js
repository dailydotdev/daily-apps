import Vue from 'vue';
import Vuex from 'vuex';

import ui from './modules/ui';
import feed from './modules/feed';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { ui, feed },
});
