<template>
  <div class="rank-progress" :class="cls" @mouseover="onMouseOver" @mouseout="hover = false">
    <da-radial-progress class="rank-progress__bar" :rank="rank" :progress="progress"
                        :max-degrees="maxDegrees" @transitionend="onProgressTransitionEnd"/>
    <da-rank class="rank-progress__badge" :rank="rank"/>
    <da-rank class="rank-progress__next" :rank="rank+1" v-if="hasRank && !finalRank"/>
    <transition name="rank-notification-slide-down">
      <div class="rank-progress__notification nuggets" v-if="animatingProgress">
        +{{progressDelta}} Reading article
      </div>
    </transition>
  </div>
</template>

<script>
import DaRank from './DaRank.vue';
import DaRadialProgress from './DaRadialProgress.vue';
import {
  rankToColor, rankToGradientStopBottom, rankToGradientStopTop, STEPS_PER_RANK,
} from '../common/rank';

export default {
  name: 'DaRankProgress',
  components: { DaRadialProgress, DaRank },
  props: {
    progress: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    enableHover: {
      type: Boolean,
      default: true,
    },
    fillByDefault: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hover: false,
      animatingProgress: false,
      progressDelta: 1,
    };
  },
  computed: {
    finalRank() {
      return this.rank === STEPS_PER_RANK.length;
    },
    hasRank() {
      return this.rank > 0;
    },
    maxDegrees() {
      return this.hover && this.hasRank ? 270 : 360;
    },
    cls() {
      return {
        'has-rank': this.hasRank,
        hover: this.hover,
        color: this.hover || this.fillByDefault || this.animatingProgress,
      };
    },
  },
  watch: {
    rank() {
      this.updateColors();
    },
    progress(newVal, oldVal) {
      if (newVal > oldVal) {
        this.progressDelta = newVal - oldVal;
        this.animatingProgress = true;
      }
    },
  },
  methods: {
    onMouseOver() {
      if (this.enableHover && !this.animatingProgress) {
        this.hover = true;
      }
    },
    updateColors() {
      if (this.rank > 0) {
        this.$el.style.setProperty('--rank-color', rankToColor(this.rank));
        this.$el.style.setProperty('--rank-stop-color1', rankToGradientStopBottom(this.rank));
        this.$el.style.setProperty('--rank-stop-color2', rankToGradientStopTop(this.rank));
      } else {
        this.$el.style.setProperty('--rank-color', 'var(--theme-secondary)');
      }
    },
    onProgressTransitionEnd() {
      setTimeout(() => {
        this.animatingProgress = false;
      }, 2000);
    },
  },
  mounted() {
    this.updateColors();
  },
};
</script>

<style>
.rank-progress {
  position: relative;
  width: 48px;
  height: 48px;

  & .rank-progress__bar {
    width: 100%;
    height: 100%;
    --radial-progress-step: var(--theme-active);
    --radial-progress-completed-step: var(--theme-secondary);
    --radial-progress-transition-delay: 0.3s;
  }

  & .rank-progress__badge {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;

    --stop-color1: var(--theme-active);
    --stop-color2: var(--theme-active);

    & stop {
      transition: stop-color 0.1s linear;
    }
  }

  & .rank-progress__next {
    position: absolute;
    left: 32px;
    top: 32px;
    width: 24px;
    height: 24px;
    opacity: 0;

    --stop-color1: var(--theme-active);
    --stop-color2: var(--theme-active);
  }

  & .rank-progress__notification {
    position: absolute;
    left: -51px;
    top: 100%;
    width: 150px;
    text-align: center;
    margin-top: 8px;
    color: var(--rank-color);
  }

  &.has-rank {
    & .rank-progress__badge {
      --stop-color1: var(--theme-secondary);
      --stop-color2: var(--theme-secondary);
    }
  }

  &.color {
    &.has-rank .rank-progress__badge {
      --stop-color1: var(--rank-stop-color1);
      --stop-color2: var(--rank-stop-color2);
    }

    & .rank-progress__bar {
      --radial-progress-completed-step: var(--rank-color);
    }
  }

  &.hover {
    & .rank-progress__next {
      opacity: 1;
    }
  }
}

.rank-notification-slide-down-enter-active, .rank-notification-slide-down-leave-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.rank-notification-slide-down-enter, .rank-notification-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
