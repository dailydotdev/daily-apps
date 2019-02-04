import Vue from 'vue';
import svgicon from 'vue-svgicon';
import VueMasonry from 'vue-masonry-css';
import '@daily/components/src/filters';
import App from './App.vue';
import store from '../store';

Vue.use(svgicon);
Vue.use(VueMasonry);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});

window.onbeforeunload = () => {
  window.scrollTo(0, 0);
};