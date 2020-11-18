import {storiesOf} from "@storybook/vue";
import {number, withKnobs} from "@storybook/addon-knobs";

import DaCounter from '../src/components/DaCounter.vue';

storiesOf('DaCounter', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    components: { DaCounter },
    template: '<da-counter :value="value" style="color: var(--theme-primary);"/>',
    props: {
      value: {
        default: number('value', 0),
      },
    },
  }));
