import { storiesOf } from '@storybook/vue';

import DaModeSwitch from '../src/components/DaModeSwitch.vue';

storiesOf('DaModeSwitch', module)
  .add('default', () => ({
    components: { DaModeSwitch },
    template: '<da-mode-switch first-icon="link" second-icon="hashtag" title="Change mode" :checked="modeSwitchChecked" @toggle="modeSwitchChecked = $event"/>',
    data() {
      return { modeSwitchChecked: false };
    },
  }));

