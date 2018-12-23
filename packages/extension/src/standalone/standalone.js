import Vue from 'vue';
import svgicon from 'vue-svgicon';
import App from './App.vue';
import store from '../store';

Vue.use(svgicon);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
