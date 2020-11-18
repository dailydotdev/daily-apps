<template>
  <span class="counter">
    <transition name="counter">
      <span :key="value">{{value}}</span>
    </transition>
  </span>
</template>

<script>
export default {
  name: 'DaCounter',
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
  },
};
</script>

<style>
.counter {
  position: relative;

  & span {
    display: inline-block;
  }
}

.counter-enter-active {
  position: absolute;
  top: 0;
  left: 0;
}

.counter-enter-active, .counter-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  will-change: opacity, transform;
}

.counter-enter {
  opacity: 0;
  transform: translate3d(0, 20px, 0);
}

.counter-leave-active {
  opacity: 0;
  transform: translate3d(0, -20px, 0);
}
</style>
