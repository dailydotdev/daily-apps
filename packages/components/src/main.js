import Vue from 'vue';
import svgicon from 'vue-svgicon';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(svgicon);

new Vue({
  render: h => h(App),
}).$mount('#app');
