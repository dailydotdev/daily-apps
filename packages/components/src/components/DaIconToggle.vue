<template>
  <label
    class="icon-toggle">
    <input type="checkbox"
           :checked="pressed"
           @change="toggle">
    <svgicon
      :name="icon"/>
    <svgicon
      :name="pressedIcon"
      class="pressed"/>
  </label>
</template>

<script>
export default {
  name: 'DaIconToggle',

  props: {
    pressed: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: true,
    },
    pressedIcon: {
      type: String,
      required: true,
    },
  },

  methods: {
    toggle(event) {
      this.$emit('toggle', event.target.checked);
    },
  },
};
</script>

<style>
.icon-toggle {
  display: flex;
  background: none;
  border: none;
  outline: 0;
  cursor: pointer;
  user-select: none;

  &:hover .svg-icon {
    color: var(--theme-primary);
  }

  & input {
    display: none;

    &:checked {
      & ~ .svg-icon {
        display: none;
      }

      & ~ .pressed {
        display: block;
      }
    }
  }

  & .svg-icon {
    width: 100%;
    height: 100%;
    color: inherit;
  }

  & .pressed {
    display: none;
  }
}
</style>
