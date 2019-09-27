import Vue from 'vue';
import svgicon from 'vue-svgicon';
import App from './App.vue';
import tooltip from './directives/tooltip';
import mdyDateFilter from './common/mdyDateFilter';

Vue.config.productionTip = false;

Vue.use(svgicon);
Vue.directive('tooltip', tooltip);
Vue.filter('mdyDate', mdyDateFilter);

new Vue({
  render: h => h(App),
}).$mount('#app');
