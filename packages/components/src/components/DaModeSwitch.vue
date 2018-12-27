<template>
  <label class="mode-switch">
    <span class="mode-switch__container">
      <input
        type="checkbox"
        :checked="checked"
        @change="toggle">
      <span class="mode-switch__slider"/>
      <span class="mode-switch__handle shadow" ref="handle"/>
      <svgicon :icon="firstIcon" class="mode-switch__icon mode-switch__icon--first"/>
      <svgicon :icon="secondIcon" class="mode-switch__icon mode-switch__icon--second"/>
    </span>
  </label>
</template>

<script>
export default {
  name: 'DaModeSwitch',

  props: {
    firstIcon: {
      type: String,
      required: true,
    },
    secondIcon: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
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
.mode-switch {
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
      & ~ .mode-switch__handle {
        transform: translateX(100%);
      }
    }
  }
}

.mode-switch__container {
  display: flex;
  position: relative;
  width: 112px;
  height: 32px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  z-index: 1;
}

.mode-switch__icon.svg-icon {
  width: 20px;
  height: 20px;
  transform-origin: center;
  transition: transform 0.2s linear, color 0.2s linear;

  &:hover {
    color: var(--theme-secondary);
  }
}

.mode-switch input:checked ~ .mode-switch__icon.mode-switch__icon--second,
.mode-switch input:not(:checked) ~ .mode-switch__icon.mode-switch__icon--first {
  color: var(--theme-primary);
  transform: scale(1.2);
}

.mode-switch__slider {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 112px;
  height: 28px;
  margin: auto;
  background: var(--theme-background-primary);
  border-radius: 8px;
  z-index: -2;
}

.mode-switch__handle {
  position: absolute;
  left: 0;
  top: 0;
  width: 56px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-water-60);
  will-change: transform;
  transition: transform 0.2s linear;
  z-index: -1;
}
</style>
