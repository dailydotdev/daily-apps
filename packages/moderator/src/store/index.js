import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import requests from './modules/requests';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { user, requests },
});
