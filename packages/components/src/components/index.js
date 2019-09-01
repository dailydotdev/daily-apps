import Vue from 'vue';
import svgicon from 'vue-svgicon';
import VTooltip from 'v-tooltip';

Vue.use(svgicon);
Vue.use(VTooltip);

const requireComponent = require.context('.', false, /Da[\w-]+.vue$/);

requireComponent.keys().forEach((filename) => {
  // Get Component Config
  const componentConfig = requireComponent(filename);
  // Get PascalCase name of component
  const componentName = filename.replace(/^\.\//, '').replace(/\.\w+$/, '');
  Vue.component(componentName, componentConfig.default || componentConfig);
});

export default requireComponent;
