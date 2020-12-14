<template>
  <div class="rank-progress" :class="cls" @mouseover="onMouseOver" @mouseout="hover = false">
    <div class="rank-progress__attention" ref="attention" v-if="showRankAnimation"></div>
    <da-radial-progress class="rank-progress__bar" :steps="steps" :progress="progress"
                        :max-degrees="maxDegrees" @transitionend="onProgressTransitionEnd"
                        ref="progress"/>
    <da-rank class="rank-progress__badge" :rank="shownRank" ref="badge"/>
    <transition name="rank-notification-slide-down">
      <div class="rank-progress__notification nuggets"
           v-if="animatingProgress && !showRankAnimation">
        +{{ progressDelta }} Article{{ progressDelta > 1 ? 's' : ''}} read
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
    showRankAnimation: {
      type: Boolean,
      default: false,
    },
    showCurrentRankSteps: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hover: false,
      animatingProgress: false,
      progressDelta: 1,
      forceColor: false,
      shownRank: this.showRankAnimation ? this.rank - 1 : this.rank,
      maxDegrees: 360,
    };
  },
  computed: {
    finalRank() {
      return this.shownRank === STEPS_PER_RANK.length;
    },
    hasRank() {
      return this.shownRank > 0;
    },
    steps() {
      if (this.showRankAnimation || this.showCurrentRankSteps
        || (this.finalRank && this.progress < STEPS_PER_RANK[this.rank - 1])) {
        return STEPS_PER_RANK[this.rank - 1];
      }
      if (!this.finalRank) {
        return STEPS_PER_RANK[this.rank];
      }
      return 0;
    },
    cls() {
      return {
        'has-rank': this.hasRank,
        hover: this.hover,
        color: this.hover || this.fillByDefault || this.animatingProgress || this.forceColor,
      };
    },
  },
  watch: {
    rank() {
      if (!this.showRankAnimation) {
        this.shownRank = this.rank;
      }
    },
    shownRank() {
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
      if (this.enableHover && !this.animatingProgress && !this.showRankAnimation) {
        this.hover = true;
      }
    },
    updateColors() {
      if (this.shownRank > 0) {
        this.$el.style.setProperty('--rank-color', rankToColor(this.shownRank));
        this.$el.style.setProperty('--rank-stop-color1', rankToGradientStopBottom(this.shownRank));
        this.$el.style.setProperty('--rank-stop-color2', rankToGradientStopTop(this.shownRank));
      } else {
        this.$el.style.setProperty('--rank-color', 'var(--theme-secondary)');
      }
    },
    onProgressTransitionEnd() {
      if (this.showRankAnimation) {
        this.animatingProgress = false;
        this.animateRank();
      } else {
        setTimeout(() => {
          this.animatingProgress = false;
        }, 2000);
      }
    },
    animateRank() {
      this.forceColor = true;
      const firstAnimationDuration = 400;
      const maxScale = 1.666;
      const progressAnimation = this.$refs.progress.$el.animate([
        { transform: 'scale(1)', '--radial-progress-completed-step': rankToColor(this.shownRank) },
        { transform: `scale(${maxScale})` },
        { transform: 'scale(1)', '--radial-progress-completed-step': rankToColor(this.rank) },
      ], { duration: firstAnimationDuration, fill: 'forwards' });
      const firstBadgeAnimation = this.$refs.badge.$el.animate([
        {
          transform: 'scale(1)',
          '--stop-color1': rankToGradientStopBottom(this.shownRank),
          '--stop-color2': rankToGradientStopTop(this.shownRank),
        },
        { transform: `scale(${maxScale})`, opacity: 1 },
        { transform: 'scale(1)', opacity: 0 },
      ], { duration: firstAnimationDuration, fill: 'forwards' });
      firstBadgeAnimation.onfinish = () => {
        this.shownRank = this.rank;
        // Let the new rank update
        setTimeout(() => {
          const attentionAnimation = this.$refs.attention.animate([
            {
              transform: 'scale(0.5)', opacity: 1,
            },
            {
              transform: 'scale(1.5)', opacity: 0,
            },
          ], { duration: 600, fill: 'forwards' });
          const lastBadgeAnimation = this.$refs.badge.$el.animate([
            {
              transform: `scale(${2 - maxScale})`,
              opacity: 0,
              '--stop-color1': rankToGradientStopBottom(this.rank),
              '--stop-color2': rankToGradientStopTop(this.rank),
            },
            {
              transform: 'scale(1)',
              opacity: 1,
              '--stop-color1': rankToGradientStopBottom(this.rank),
              '--stop-color2': rankToGradientStopTop(this.rank),
            },
          ], { duration: 100, fill: 'forwards' });
          attentionAnimation.onfinish = () => {
            progressAnimation.cancel();
            firstBadgeAnimation.cancel();
            lastBadgeAnimation.cancel();
            attentionAnimation.cancel();
            this.forceColor = false;
            this.$emit('rank-animation-end');
          };
        });
      };
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
    width: 66.666%;
    height: 66.666%;
    margin: auto;

    --stop-color1: var(--theme-active);
    --stop-color2: var(--theme-active);

    & stop {
      transition: stop-color 0.1s linear;
    }
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
}

.rank-progress__attention {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background: var(--theme-hover);
  z-index: -1;
  opacity: 0;
}

.rank-notification-slide-down-enter-active, .rank-notification-slide-down-leave-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.rank-notification-slide-down-enter, .rank-notification-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
