<template>
  <label class="switch">
    <span class="switch-container">
      <input
        type="checkbox"
        :checked="checked"
        @change="onChange"
        ref="input">
      <span class="slider"/>
      <span class="handle" ref="handle">
        <svgicon
          :name="icon"
          v-if="icon"/>
      </span>
    </span>
    <span
      class="label lil1"
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
    onChange() {
      this.$refs.handle.addEventListener('transitionend', () => {
        requestAnimationFrame(() => {
          this.$emit('toggle', this.$refs.input.checked);
        });
      }, { once: true });
    },
  },
};
</script>

<style scoped>
.switch {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &:active {
    background: none;
  }
}

.switch-container {
  display: block;
  position: relative;
  width: var(--da-switch-width);
  height: var(--da-switch-height);
}

input {
  display: none;
}

input:checked {
  & ~ .slider {
    background: var(--da-switch-checked-color);
    opacity: 0.5;
  }

  & ~ .handle {
    transform: translateX(100%);
    background: var(--da-switch-checked-color);

    & .svg-icon {
      color: white;
    }
  }
}

.slider {
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

.handle {
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
  background: var(--color-salt-10);
  will-change: transform, background-color;
  transition: background-color 0.2s linear, transform 0.2s linear;
  box-shadow: 0 var(--shadow-offset) 16px 0 rgba(0, 0, 0, 0.1);
}

.svg-icon {
  width: calc(var(--da-switch-height) - 4px);
  height: calc(var(--da-switch-height) - 4px);
  color: var(--da-switch-color);
  transition: color 0.2s linear;
}

.label {
  margin-left: 24px;
  color: var(--color-salt-50);
}
</style>
