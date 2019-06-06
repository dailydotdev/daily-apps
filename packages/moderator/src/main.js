import Vue from 'vue';
import svgicon from 'vue-svgicon';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(svgicon);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
