<template>
  <label class="switch" :class="{ checked }">
    <span class="switch__container">
      <input
        :name="name"
        type="checkbox"
        :checked="checked"
        @change="toggle">
      <span class="switch__slider"/>
      <span class="switch__handle" ref="handle">
        <svgicon :name="icon" v-if="icon"/>
      </span>
    </span>
    <span
      class="switch__label lil1"
      v-if="label">{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: 'DaSwitch',

  props: {
    icon: {
      type: String,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: null,
    },
    name: {
      type: String,
    },
    immediateEvent: {
      type: Boolean,
      required: false,
    },
  },

  methods: {
    toggle(event) {
      if (this.immediateEvent) {
        this.$emit('toggle', event.target.checked);
      } else {
        // Need to wait for the long transition to prevent jagged animation
        this.$refs.handle.addEventListener('transitionend', () => {
          this.$refs.handle.addEventListener('transitionend', () => {
            setTimeout(() => {
              this.$emit('toggle', event.target.checked);
            });
          }, { once: true });
        }, { once: true });
      }
    },
  },
};
</script>

<style>
.switch {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &:active {
    background: none;
  }

  & input {
    display: none;

    &:checked {
      & ~ .switch__slider {
        background: var(--da-switch-checked-background);
        opacity: 1;
      }

      & ~ .switch__handle {
        transform: translateX(100%);
        background: var(--da-switch-checked-color);

        & .svg-icon {
          color: var(--color-salt-10);
        }
      }
    }
  }

  & .svg-icon {
    width: calc(var(--da-switch-height) - 4px);
    height: calc(var(--da-switch-height) - 4px);
    color: var(--da-switch-icon-color);
    transition: color 0.2s linear;
  }

  &:hover .switch__handle {
    background: var(--theme-primary);
  }

  &.small {
    --da-switch-width: 32px;
    --da-switch-height: 16px;
    --da-switch-slider-height: 10px;

    & .switch__slider,
    & .switch__handle {
      border-radius: 3px;
    }

    & .switch__label {
      margin-left: 12px;
      @mixin nuggets;
    }
  }
}

.switch__container {
  display: block;
  position: relative;
  width: var(--da-switch-width);
  height: var(--da-switch-height);
}

.switch__slider {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: var(--da-switch-slider-height);
  margin: auto 0;
  border-radius: 4px;
  background: var(--da-switch-color);
  opacity: var(--da-switch-opacity);
  will-change: background-color, opacity;
  transition: background-color 0.1s linear, opacity 0.2s linear;
}

.switch__handle {
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  width: var(--da-switch-height);
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: var(--theme-secondary);
  will-change: transform, background-color;
  transition: background-color 0.1s linear, transform 0.2s linear;
}

.switch__label {
  margin-left: 16px;
  color: var(--theme-secondary);

  .checked & {
    color: var(--theme-primary);
  }
}
</style>
