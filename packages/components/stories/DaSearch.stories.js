import { storiesOf } from '@storybook/vue';
import {
  withKnobs,
  boolean, select,
} from '@storybook/addon-knobs';

import DaSearch from '../src/components/DaSearch';
import posts from '../src/posts';

storiesOf('DaSearch', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    components: { DaSearch },
    template: '<da-search placeholder="Search here something..." label="Search" :disabled="disabled" :class="mode"/>',
    props: {
      disabled: {
        default: boolean('disabled', false),
      },
      mode: {
        default: select('size', ['default', 'border', 'float'], 'default'),
      }
    }
  }));

