import Vue from 'vue';
import { configure, addParameters } from '@storybook/vue';

import svgicon from 'vue-svgicon';

import darkTheme from './dark';
import '../stories/style.pcss';

Vue.use(svgicon);

addParameters({
  options: {
    theme: darkTheme,
  },
});

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
