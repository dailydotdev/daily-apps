import { storiesOf } from '@storybook/vue';

import DaRadio from '../src/components/DaRadio.vue';

storiesOf('DaRadio', module)
  .add('default', () => ({
    components: { DaRadio },
    template: '<da-radio name="queen" :options="{ \'bohemian\': \'Bohemian Rhapsody\', \'gaga\': \'Radio Gaga\' }" :value="value" @toggle="value = $event" />',
    data() {
      return { value: null };
    },
  }));

