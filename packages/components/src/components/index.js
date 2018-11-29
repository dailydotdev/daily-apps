import Vue from 'vue';

const requireComponent = require.context('.', false, /Daily[\w-]+.vue$/);

requireComponent.keys().forEach((filename) => {
  // Get Component Config
  const componentConfig = requireComponent(filename);
  // Get PascalCase name of component
  const componentName = filename.replace(/^\.\//, '').replace(/\.\w+$/, '');
  Vue.component(componentName, componentConfig.default || componentConfig);
});

export default requireComponent;
