<template>
  <label class="mode-switch">
    <input
      type="checkbox"
      :checked="checked"
      @change="toggle">
    <span class="mode-switch__slider"/>
    <span class="mode-switch__handle shadow1" ref="handle"/>
    <svgicon :icon="firstIcon" class="mode-switch__icon mode-switch__icon--first"/>
    <svgicon :icon="secondIcon" class="mode-switch__icon mode-switch__icon--second"/>
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
      // Mechanism to prevent jagged animation
      this.$refs.handle.addEventListener('transitionend', () => {
        setTimeout(() => {
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
  position: relative;
  width: 112px;
  height: 32px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  z-index: 1;
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

.mode-switch__icon.svg-icon {
  width: 20px;
  height: 20px;
  transform-origin: center;
  transition: transform 0.2s linear, color 0.1s linear;
}

.mode-switch input:checked ~ .mode-switch__icon.mode-switch__icon--second,
.mode-switch input:not(:checked) ~ .mode-switch__icon.mode-switch__icon--first {
  color: var(--color-salt-10);
  transform: scale(1.2);
  pointer-events: none;
}

.mode-switch input:checked ~ .mode-switch__icon.mode-switch__icon--first,
.mode-switch input:not(:checked) ~ .mode-switch__icon.mode-switch__icon--second {
  &:hover {
    color: var(--theme-primary);
  }
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

  &:hover {
    background: var(--color-water-50);
  }
}

.bright {
  & .mode-switch__handle {
    &:hover {
      background: var(--color-water-70);
    }
  }
}
</style>
