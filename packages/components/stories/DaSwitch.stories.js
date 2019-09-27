import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import DaSwitch from '../src/components/DaSwitch.vue';

storiesOf('DaSwitch', module)
  .add('default', () => ({
    components: { DaSwitch },
    template: '<da-switch icon="bookmark" @toggle="toggle"/>',
    methods: {
      toggle: action('toggle'),
    },
  }))
  .add('with label', () => ({
    components: { DaSwitch },
    template: '<da-switch icon="link" label="This is label :)" @toggle="toggle"/>',
    methods: {
      toggle: action('toggle'),
    },
  }))
  .add('small with label', () => ({
    components: { DaSwitch },
    template: '<da-switch class="small" icon="link" label="This is label :)" @toggle="toggle"/>',
    methods: {
      toggle: action('toggle'),
    },
  }))
  .add('checked', () => ({
    components: { DaSwitch },
    template: '<da-switch icon="moon" checked label="This is label :)" @toggle="toggle"/>',
    methods: {
      toggle: action('toggle'),
    },
  }));

