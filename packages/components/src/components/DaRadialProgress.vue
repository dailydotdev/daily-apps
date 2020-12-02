<template>
  <div class="radial-progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0"
       :aria-valuemax="steps">
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path v-for="(d, i) in stepsPaths" :key="i" :d="d" :class="{ 'completed': i < progress}"/>
    </svg>
  </div>
</template>

<script>
import { STEPS_PER_RANK } from '../common/rank';

const RAD_TO_DEGREES = 180 / Math.PI;

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) / RAD_TO_DEGREES;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

export default {
  name: 'DaRadialProgress',
  props: {
    progress: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    maxDegrees: {
      type: Number,
      default: 360,
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
  },
};
</script>

<style>
.radial-progress {
  width: 48px;
  height: 48px;

  & svg {
    width: 100%;
    height: 100%;
  }

  & path {
    stroke: var(--radial-progress-step);
    stroke-width: 4;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke 0.1s linear;
  }

  & path.completed {
    stroke: var(--radial-progress-completed-step);
  }
}
</style>
