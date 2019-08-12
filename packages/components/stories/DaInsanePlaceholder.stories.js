import { storiesOf } from '@storybook/vue';

import DaInsanePlaceholder from '../src/components/DaInsanePlaceholder.vue';

storiesOf('DaInsanePlaceholder', module)
  .add('default', () => ({
    components: { DaInsanePlaceholder },
    template: '<da-insane-placeholder/>',
  }));

