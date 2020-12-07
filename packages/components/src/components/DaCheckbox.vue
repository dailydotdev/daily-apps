<template>
  <label class="checkbox" :class="{checked}">
    <input type="checkbox" :name="name" :checked="checked" @change="toggle">
    <span class="checkbox__checkmark">
      <svgicon name="v"/>
    </span>
    <slot></slot>
  </label>
</template>

<script>
import '../../icons/v';

export default {
  name: 'DaCheckbox',
  props: {
    name: {
      type: String,
      required: true,
    },
    checked: Boolean,
  },
  methods: {
    toggle(event) {
      this.$emit('toggle', event.target.checked);
    },
  },
};
</script>

<style>
.checkbox {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  color: var(--theme-secondary);
  transition: color 0.1s linear;
  @mixin nuggets;

  & input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;

    &.focus-visible:focus ~ .checkbox__checkmark:after {
      box-shadow: 0 0 0 2px var(--color-water-40);
    }

    &:active .checkbox__checkmark:before {
      background: var(--theme-focus);
      opacity: 1;
    }
  }

  &:hover,
  &.checked {
    color: var(--theme-primary);
  }

  &:hover {
    cursor: pointer;

    & .checkbox__checkmark {
      & .svg-icon {
        opacity: 1;
      }

      &:before {
        background: var(--theme-hover);
        opacity: 1;
      }
    }
  }

  &.checked {
    & .checkbox__checkmark {
      & .svg-icon {
        color: var(--color-salt-10);
        opacity: 1;
      }

      &:after {
        border: none;
        background: var(--color-water-60);
      }
    }

    &:hover {
      & .checkbox__checkmark {
        &:before {
          background: var(--color-water-60);
          opacity: 0.24;
        }
      }
    }
  }
}

.checkbox__checkmark {
  position: relative;
  display: flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  .svg-icon {
    width: 16px;
    height: 16px;
    color: var(--theme-secondary);
    opacity: 0;
  }

  &:before,
  &:after {
    margin: auto;
    content: '';
    position: absolute;
    box-sizing: border-box;
    z-index: -1;
  }

  &:before {
    left: -9999px;
    top: -9999px;
    right: -9999px;
    bottom: -9999px;
    width: 200%;
    height: 200%;
    border-radius: 100%;
    opacity: 0;
    transition: background-color 0.1s linear, opacity 0.1s linear;
    pointer-events: none;
  }

  &:after {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: 2px solid var(--theme-secondary);
  }
}
</style>
