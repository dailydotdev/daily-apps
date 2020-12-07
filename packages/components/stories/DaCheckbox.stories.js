import { storiesOf } from '@storybook/vue';

import DaCheckbox from '../src/components/DaCheckbox';

storiesOf('DaCheckbox', module)
  .add('default', () => ({
    components: { DaCheckbox },
    template: '<da-checkbox name="gaga" :checked="checked" @toggle="checked = $event">Radio Gaga</da-checkbox>',
    data() {
      return { checked: false };
    },
  }));

