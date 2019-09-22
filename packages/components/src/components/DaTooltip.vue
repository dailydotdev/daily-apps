<template>
  <transition name="tooltip-trans">
    <div id="tooltip" class="tooltip" role="tooltip" :class="{[placement]: true}"
         v-show="show" :aria-hidden="!show">
      <div class="tooltip__arrow"></div>
      <div class="tooltip__inner">{{content}}</div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DaTooltip',
  props: {
    content: {
      type: String,
      default: '',
    },
    placement: {
      type: String,
      default: 'top',
    },
    show: Boolean,
  },
};
</script>

<style>
.tooltip {
  display: inline-block;
  position: relative;
  z-index: 10000;
  font-size: 12px;
  padding: 4px;
  pointer-events: none;
  will-change: opacity, transform;

  &.top {
    & .tooltip__arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent;
      border-right-color: transparent;
      border-bottom-color: transparent;
      bottom: -1px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &.bottom {
    & .tooltip__arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent;
      border-right-color: transparent;
      border-top-color: transparent;
      top: -1px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }
}

.tooltip__inner {
  background-color: var(--theme-primary);
  color: var(--theme-primary-invert);
  border-radius: 4px;
  padding: 4px 8px;

  @mixin micro2;
}

.tooltip__arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  border-color: var(--theme-primary);
  z-index: 1;
}

.tooltip-trans-enter-active, .tooltip-trans-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.tooltip-trans-enter, .tooltip-trans-leave-to {
  opacity: 0;
}

.tooltip-trans-enter {
  &.top {
    transform: translateY(5px);
  }

  &.bottom {
    transform: translateY(-5px);
  }
}
</style>
