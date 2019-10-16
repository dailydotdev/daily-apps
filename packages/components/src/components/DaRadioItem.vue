<template>
  <label class="radio-item" :class="{checked}">
    <input type="radio" :name="name" :checked="checked" @change="toggle">
    <span class="radio-item__checkmark">
      <span class="radio-item__checkmark__focus"></span>
    </span>
    <slot></slot>
  </label>
</template>

<script>
export default {
  name: 'DaRadioItem',
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
.radio-item {
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

    &.focus-visible:focus ~ .radio-item__checkmark .radio-item__checkmark__focus {
      opacity: 1;
    }

    &:active .radio-item__checkmark:before {
      background: var(--theme-focus);
      opacity: var(--theme-focus-opacity);
    }
  }

  &:hover,
  &.checked {
    color: var(--theme-primary);
  }

  &:hover {
    cursor: pointer;

    & .radio-item__checkmark:before {
      background: var(--theme-hover);
      opacity: var(--theme-hover-opacity);
    }
  }

  &.checked {
    & .radio-item__checkmark:after {
      border: 4px solid var(--color-water-60);
      background: var(--color-water-90);
    }

    &:hover {
      & .radio-item__checkmark:before {
        background: var(--color-water-60);
        opacity: 0.24;
      }
    }
  }
}

.radio-item__checkmark {
  position: relative;
  width: 32px;
  height: 32px;
  margin-right: 4px;

  &:before,
  &:after,
  & .radio-item__checkmark__focus {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 100%;
    box-sizing: border-box;
  }

  &:before {
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: background-color 0.1s linear, opacity 0.1s linear;
  }

  &:after,
  & .radio-item__checkmark__focus {
    width: 50%;
    height: 50%;
  }

  &:after {
    border: 2px solid var(--theme-secondary);
  }

  & .radio-item__checkmark__focus {
    opacity: 0;
    border: 2px solid var(--color-water-40);
    transition: opacity 0.1s linear;
    box-sizing: content-box;
  }
}
</style>
