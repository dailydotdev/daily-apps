import Vue from 'vue';
import svgicon from 'vue-svgicon';
import App from './App.vue';
import tooltip from './directives/tooltip';

Vue.config.productionTip = false;

Vue.use(svgicon);
Vue.directive('tooltip', tooltip);

new Vue({
  render: h => h(App),
}).$mount('#app');
