import Vue from 'vue';
import icons from '@daily/components/src/icons';
import App from './App.vue';
import router from './router';
import store from './store';
// import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(icons);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

window.OneSignal = window.OneSignal || [];
window.OneSignal.push(() => {
  window.OneSignal.init({
    appId: process.env.VUE_APP_ONESIGNAL,
    allowLocalhostAsSecureOrigin: process.env.NODE_ENV !== 'production',
  });
});
