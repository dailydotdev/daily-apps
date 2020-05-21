import { storiesOf } from '@storybook/vue';
import {
  withKnobs,
  boolean, select,
} from '@storybook/addon-knobs';

import DaSearchField from '../src/components/DaSearchField';

storiesOf('DaSearchField', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    components: { DaSearchField },
    template: '<da-search-field placeholder="Type your query..." label="Search" icon="magnifying" :disabled="disabled" :class="mode"/>',
    props: {
      disabled: {
        default: boolean('disabled', false),
      },
      mode: {
        default: select('mode', ['default', 'border', 'float'], 'default'),
      }
    }
  }));

