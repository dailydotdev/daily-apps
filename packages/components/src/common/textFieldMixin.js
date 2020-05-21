export default {
  props: {
    placeholder: String,
    label: String,
    disabled: Boolean,
  },

  data() {
    return {
      focused: false,
      value: null,
    };
  },

  computed: {
    inputPlaceholder() {
      if (this.focused && this.placeholder) {
        return this.placeholder;
      }
      return this.label;
    },
    hasInput() {
      return this.value && this.value.length;
    },
    active() {
      return !this.disabled && this.hasInput;
    },
  },

  methods: {
    onInput() {
      this.value = this.$refs.input.value;
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    },
    clearInput() {
      this.$refs.input.value = '';
      this.onInput();
    },
    focusInput() {
      if (!this.focused) {
        this.$refs.input.focus();
      }
    },
  },
};
