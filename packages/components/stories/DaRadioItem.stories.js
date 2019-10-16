import { storiesOf } from '@storybook/vue';

import DaRadioItem from '../src/components/DaRadioItem.vue';

storiesOf('DaRadioItem', module)
  .add('default', () => ({
    components: { DaRadioItem },
    template: '<da-radio-item name="gaga" :checked="checked" @toggle="checked = $event">Radio Gaga</da-radio-item>',
    data() {
      return { checked: false };
    },
  }));

