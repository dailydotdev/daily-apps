<template>
  <div class="rank-progress" :class="cls" @mouseover="hover = true" @mouseout="hover = false">
    <svg class="rank-progress__bar" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path v-for="(d, i) in stepsPaths" :key="i" :d="d" :class="{ 'completed': i < progress}"/>
    </svg>
    <da-rank class="rank-progress__badge" :rank="rank"/>
    <da-rank class="rank-progress__next" :rank="rank+1" v-if="hasRank && !finalRank"/>
  </div>
</template>

<script>
import DaRank from './DaRank.vue';

const RAD_TO_DEGREES = 180 / Math.PI;
const STEPS_PER_RANK = [3, 4, 5, 6, 7];

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) / RAD_TO_DEGREES;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

export default {
  name: 'DaRankProgress',
  components: { DaRank },
  props: {
    progress: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      center: 24,
      radius: 22,
      stepsGap: 8,
      hover: false,
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
    steps() {
      if (!this.finalRank) {
        return STEPS_PER_RANK[this.rank];
      }
      return 0;
    },
    gapDegrees() {
      return (this.stepsGap / this.radius) * RAD_TO_DEGREES;
    },
    stepAngle() {
      return this.maxDegrees / this.steps;
    },
    stepsPaths() {
      if (this.steps > 0) {
        return [...new Array(this.steps)].map((_, i) => {
          const startAngle = 180 + this.stepAngle * i + (this.gapDegrees / 2);
          const endAngle = startAngle + this.stepAngle - this.gapDegrees;
          return this.describeArc(startAngle, endAngle);
        });
      }
      return [this.describeArc(0, 359)];
    },
    cls() {
      return {
        'has-rank': this.hasRank,
        hover: this.hover,
      };
    },
  },
  watch: {
    rank() {
      this.updateColors();
    },
  },
  methods: {
    describeArc(startAngle, endAngle) {
      const start = polarToCartesian(this.center, this.center, this.radius, endAngle);
      const end = polarToCartesian(this.center, this.center, this.radius, startAngle);

      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

      return [
        'M', start.x, start.y,
        'A', this.radius, this.radius, 0, largeArcFlag, 0, end.x, end.y,
      ].join(' ');
    },
    updateColors() {
      if (this.rank > 0) {
        this.$el.style.setProperty('--rank-color', `var(--theme-rank-${this.rank}-color)`);
        this.$el.style.setProperty('--rank-stop-color1', `var(--theme-rank-${this.rank}-color-bottom)`);
        this.$el.style.setProperty('--rank-stop-color2', `var(--theme-rank-${this.rank}-color-top)`);
      } else {
        this.$el.style.setProperty('--rank-color', 'var(--theme-secondary)');
      }
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

    & path {
      stroke: var(--theme-active);
      stroke-width: 4;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: stroke 0.1s linear;
    }

    & path.completed {
      stroke: var(--theme-secondary);
    }
  }

  & .rank-progress__badge {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 32px;
    height: 32px;
    margin: auto;

    --stop-color1: var(--theme-active);
    --stop-color2: var(--theme-active);

    & stop {
      transition: stop-color 0.1s linear;
    }
  }

  .rank-progress__next {
    position: absolute;
    left: 32px;
    top: 32px;
    width: 24px;
    height: 24px;
    opacity: 0;

    --stop-color1: var(--theme-active);
    --stop-color2: var(--theme-active);
  }

  &.has-rank {
    & .rank-progress__badge {
      --stop-color1: var(--theme-secondary);
      --stop-color2: var(--theme-secondary);
    }
  }

  &.hover {
    &.has-rank .rank-progress__badge {
      --stop-color1: var(--rank-stop-color1);
      --stop-color2: var(--rank-stop-color2);
    }

    & .rank-progress__bar path.completed {
      stroke: var(--rank-color);
    }

    & .rank-progress__next {
      opacity: 1;
    }
  }
}
</style>
