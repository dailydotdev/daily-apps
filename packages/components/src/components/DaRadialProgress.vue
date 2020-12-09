<template>
  <div class="radial-progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0"
       :aria-valuemax="steps">
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <g :id="`${id}-group-completed`">
          <path v-for="(d, i) in completedPaths" :key="i" :d="d" class="completed"
                style="stroke-width: 4; stroke-linecap: round; stroke-linejoin: round;"/>
        </g>
        <g :id="`${id}-group-remaining`">
          <path v-for="(d, i) in remainingPaths" :key="i" :d="d"
                style="stroke-width: 4; stroke-linecap: round; stroke-linejoin: round;"/>
        </g>
      </defs>
      <mask :id="`${id}-mask-all`" stroke="white">
        <use :xlink:href="`#${id}-group-completed`"/>
        <use :xlink:href="`#${id}-group-remaining`"/>
      </mask>
      <mask :id="`${id}-mask-completed`" stroke="white">
        <use :xlink:href="`#${id}-group-completed`"/>
      </mask>
      <circle :r="radius" :cx="center" :cy="center" :mask="`url(#${id}-mask-all)`"/>
      <g :mask="`url(#${id}-mask-completed)`">
        <circle :r="radius" :cx="center" :cy="center" :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference * (1 - progressRatio)"
                class="completed" @transitionend="$emit('transitionend')"/>
      </g>
    </svg>
  </div>
</template>

<script>
const RAD_TO_DEGREES = 180 / Math.PI;
const TWO_PI = 2 * Math.PI;

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
    steps: {
      type: Number,
      required: true,
    },
    maxDegrees: {
      type: Number,
      default: 360,
    },
  },
  data() {
    const radius = 22;
    return {
      id: Math.random().toString(36).substring(7),
      center: 24,
      radius,
      stepsGap: 8,
      hover: false,
      circumference: TWO_PI * radius,
    };
  },
  computed: {
    progressRatio() {
      if (this.steps > 0) {
        return this.progress / this.steps;
      }
      return 1;
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
    completedPaths() {
      if (this.progress > 0) {
        return this.stepsPaths.slice(0, this.progress);
      }
      return [];
    },
    remainingPaths() {
      return this.stepsPaths.slice(this.progress);
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
  overflow: hidden;

  & svg {
    width: 100%;
    height: 100%;
  }

  & circle {
    stroke-width: 4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  & circle {
    fill: none;
    stroke: var(--radial-progress-step);

    &.completed {
      stroke: var(--radial-progress-completed-step);
      transform: rotate(90deg);
      transform-origin: center;
      transition: stroke-dashoffset 0.5s ease-out var(--radial-progress-transition-delay);
    }
  }
}
</style>
