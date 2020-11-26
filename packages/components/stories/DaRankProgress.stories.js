import {storiesOf} from "@storybook/vue";
import {number, withKnobs} from "@storybook/addon-knobs";

import DaRankProgress from '../src/components/DaRankProgress.vue';

storiesOf('DaRankProgress', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    components: { DaRankProgress },
    template: '<da-rank-progress :progress="progress" :rank="rank"/>',
    props: {
      progress: {
        default: number('progress', 0),
      },
      rank: {
        default: number('rank', 0),
      },
    },
  }));
