import {storiesOf} from "@storybook/vue";
import {boolean, number, withKnobs} from "@storybook/addon-knobs";

import DaRankProgress from '../src/components/DaRankProgress.vue';
import {STEPS_PER_RANK} from '../src/common/rank';

storiesOf('DaRankProgress', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    components: { DaRankProgress },
    template: '<da-rank-progress :progress="progress" :rank="rank" :show-rank-animation="showRankAnimation" style="margin-left: 300px"/>',
    props: {
      progress: {
        default: number('progress', 0),
      },
      rank: {
        default: number('rank', 0),
      },
      showRankAnimation: {
        default: boolean('show rank animation', false),
      },
    },
  }))
  .add('rank animation', () => ({
    components: { DaRankProgress },
    template: '<da-rank-progress :progress="currentProgress" :rank="currentRank" :show-rank-animation="rankAnimation" style="margin-left: 300px; margin-top: 150px"/>',
    props: {
      progress: {
        default: number('progress', 2),
      },
      rank: {
        default: number('rank', 3),
      },
      showRankAnimation: {
        default: boolean('show rank animation', false),
      },
    },
    data() {
      return {
        currentProgress: this.progress,
        currentRank: this.rank,
        rankAnimation: this.showRankAnimation
      };
    },
    watch: {
      showRankAnimation(newVal) {
        if (newVal) {
          this.currentProgress = STEPS_PER_RANK[this.currentRank];
          this.currentRank += 1;
          this.rankAnimation = true;
        }
      },
    },
  }));
