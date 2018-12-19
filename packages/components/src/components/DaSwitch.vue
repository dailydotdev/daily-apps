<template>
  <label class="switch">
    <span class="switch__container">
      <input
        type="checkbox"
        :checked="checked"
        @change="toggle">
      <span class="switch__slider"/>
      <span class="switch__handle" ref="handle">
        <svgicon
          :name="icon"
          v-if="icon"/>
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
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: null,
    },
  },

  methods: {
    toggle(event) {
      this.$refs.handle.addEventListener('transitionend', () => {
        requestAnimationFrame(() => {
          this.$emit('toggle', event.target.checked);
        });
      }, { once: true });
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
        background: var(--da-switch-checked-color);
        opacity: 0.5;
      }

      & ~ .switch__handle {
        transform: translateX(100%);
        background: var(--da-switch-checked-color);

        & .svg-icon {
          color: white;
        }
      }
    }
  }

  & .svg-icon {
    width: calc(var(--da-switch-height) - 4px);
    height: calc(var(--da-switch-height) - 4px);
    color: var(--da-switch-color);
    transition: color 0.2s linear;
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
  will-change: background-color, opacity;
  transition: background-color 0.2s linear, opacity 0.2s linear;
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
  transition: background-color 0.2s linear, transform 0.2s linear;
  box-shadow: 0 var(--theme-shadow-offset) 16px 0 rgba(0, 0, 0, 0.1);
}

.switch__label {
  margin-left: 24px;
  color: var(--theme-secondary);
}
</style>
