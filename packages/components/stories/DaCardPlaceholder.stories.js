import { storiesOf } from '@storybook/vue';

import DaCardPlaceholder from '../src/components/DaCardPlaceholder.vue';

storiesOf('DaCardPlaceholder', module)
  .add('default', () => ({
    components: { DaCardPlaceholder },
    template: '<da-card-placeholder/>',
  }));

