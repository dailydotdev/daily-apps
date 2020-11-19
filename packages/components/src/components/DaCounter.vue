<template>
  <span class="counter">
    <transition :name="transition">
      <span :key="value">{{value > 0 ? value : ''}}</span>
    </transition>
  </span>
</template>

<script>
export default {
  name: 'DaCounter',
  props: {
    value: {
      type: Number,
      required: true,
    },
    disable: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      transition: 'counter-up',
    };
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue > oldValue && !this.disable) {
        this.transition = 'counter-up';
      } else {
        this.transition = 'counter-down';
      }
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

.counter-up-enter-active, .counter-down-enter-active {
  position: absolute;
  top: 0;
  left: 0;
}

.counter-up-enter-active, .counter-up-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  will-change: opacity, transform;
}

.counter-up-enter {
  opacity: 0;
  transform: translate3d(0, 20px, 0);
}

.counter-up-leave-active {
  opacity: 0;
  transform: translate3d(0, -20px, 0);
}
</style>
