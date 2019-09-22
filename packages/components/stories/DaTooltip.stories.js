import { storiesOf } from '@storybook/vue';
import {
  withKnobs,
  select,
  boolean,
} from '@storybook/addon-knobs';

import DaTooltip from '../src/components/DaTooltip.vue';

storiesOf('DaTooltip', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    components: { DaTooltip },
    template: '<da-tooltip content="I am a tooltip" :show="show" :placement="placement"/>',
    props: {
      show: {
        default: boolean('show', true),
      },
      placement: {
        default: select('placement', ['top', 'bottom'])
      }
    }
  }));

