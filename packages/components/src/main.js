import Vue from 'vue';
import svgicon from 'vue-svgicon';
import App from './App.vue';
import tooltip from './directives/tooltip';

Vue.config.productionTip = false;

Vue.use(svgicon);
Vue.directive('tooltip', tooltip);

// Month abbreviation, Day with leading zeros, Year Filter (Jun 30, 2019)

Vue.filter('mdyDate', value => new Date(value).toLocaleString('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
}));

new Vue({
  render: h => h(App),
}).$mount('#app');
