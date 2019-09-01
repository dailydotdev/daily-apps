import Vue from 'vue';
import svgicon from 'vue-svgicon';
import VTooltip from 'v-tooltip';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(svgicon);
Vue.use(VTooltip);

new Vue({
  render: h => h(App),
}).$mount('#app');
