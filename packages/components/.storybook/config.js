import Vue from 'vue';
import { configure, addParameters } from '@storybook/vue';

import '../stories/style.pcss';

import { VTooltip } from 'v-tooltip';
import svgicon from 'vue-svgicon';
import 'focus-visible';

import darkTheme from './dark';

Vue.use(svgicon);
Vue.directive('tooltip', VTooltip);

addParameters({
  options: {
    theme: darkTheme,
  },
});

// automatically import all icons
const requireIcons = require.context('../icons', false, /.js$/);
const icons = requireIcons.keys().filter(r => r !== './index.js');
icons.forEach(requireIcons);

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
