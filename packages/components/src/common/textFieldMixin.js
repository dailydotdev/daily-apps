export default {
  props: {
    placeholder: String,
    label: String,
    disabled: Boolean,
    hideLabel: Boolean,
  },

  data() {
    return {
      focused: false,
      currentValue: null,
    };
  },

  computed: {
    inputPlaceholder() {
      if (this.focused || this.hideLabel) {
        if (this.placeholder) {
          return this.placeholder;
        }
        return '';
      }
      return this.label;
    },
    hasInput() {
      return this.currentValue && this.currentValue.length;
    },
    active() {
      return !this.disabled && this.hasInput;
    },
  },

  methods: {
    onInput() {
      this.currentValue = this.$refs.input.value;
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    },
    updateValue(value) {
      this.$refs.input.value = value;
      this.onInput();
    },
    clearInput() {
      this.updateValue('');
    },
    focusInput() {
      if (!this.focused) {
        this.$refs.input.focus();
      }
    },
  },
};
