<template>
  <label
    class="icon-selector">
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

<style scoped>
.icon-selector {
  display: flex;
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  outline: 0;
  cursor: pointer;

  &:hover .svg-icon {
    color: var(--theme-primary);
  }
}

input {
  display: none;
}

input:checked {
  & ~ .svg-icon {
    display: none;
  }

  & ~ .pressed {
    display: block;
  }
}

.svg-icon {
  width: 100%;
  height: 100%;
  color: inherit;
}

.pressed {
  display: none;
}
</style>
