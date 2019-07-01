import { storiesOf } from '@storybook/vue';

import DaSpinner from '../src/components/DaSpinner.vue';

storiesOf('DaSpinner', module)
  .add('default', () => ({
    components: { DaSpinner },
    template: '<da-spinner/>',
  }));

