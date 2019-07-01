import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import DaIconToggle from '../src/components/DaIconToggle.vue';

storiesOf('DaIconToggle', module)
  .add('default', () => ({
    components: { DaIconToggle },
    template: '<da-icon-toggle pressed-icon="sun" icon="moon" @toggle="toggle"/>',
    methods: {
      toggle: action('toggle'),
    },
  }));

