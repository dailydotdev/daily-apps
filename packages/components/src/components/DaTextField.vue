<template>
  <div class="text-field" :class="{invalid, 'show-hint': showHint}">
    <div
      class="text-field__box field"
      :class="{focused, disabled, active}"
      @click="focusInput"
    >
      <svgicon :name="icon" class="field__icon" v-if="icon" />
      <div class="text-field__input-container">
        <label class="text-field__label micro2" v-show="showLabel">{{label}}</label>
        <input
          class="text-field__input"
          :class="{'show-label': showLabel}"
          :name="name"
          :required="required"
          :type="type"
          ref="input"
          :maxlength="maxlength"
          :placeholder="inputPlaceholder"
          :aria-label="label"
          :disabled="disabled"
          :autofocus="autofocus"
          @focus="onFocus"
          @blur="onBlurOverride"
          @input="onInputOverride"
        />
      </div>
      <span class="text-field__count lil1" v-if="maxlength">
        {{remainingChars}}
      </span>
      <slot name="right" />
    </div>
    <div class="text-field__hint micro2" :aria-live="invalid ? 'assertive' : false">
      {{hint}}
    </div>
  </div>
</template>

<script>
import textFieldMixin from '../common/textFieldMixin';

export default {
  name: 'DaTextField',
  mixins: [textFieldMixin],

  props: {
    name: String,
    icon: String,
    required: Boolean,
    type: {
      type: String,
      default: 'text',
    },
    saveHintSpace: Boolean,
    hint: String,
    maxlength: Number,
    value: String,
    autofocus: Boolean,
  },

  data() {
    return {
      invalid: null,
    };
  },

  computed: {
    showLabel() {
      return (this.focused || this.hasInput) && !this.hideLabel;
    },
    showHint() {
      return this.saveHintSpace || (this.hint && this.hint.length);
    },
    remainingChars() {
      if (this.currentValue) {
        return this.maxlength - this.currentValue.length;
      }
      return this.maxlength;
    },
  },

  watches: {
    value(val) {
      this.updateValue(val);
    },
  },

  mounted() {
    if (this.icon) {
      import(`../../icons/${this.icon}`);
    }
    if (this.value) {
      this.updateValue(this.value);
      this.updateInvalid(!this.$refs.input.checkValidity());
    }
  },

  destroyed() {
    this.clearIdleTimeout();
  },

  methods: {
    updateInvalid(val) {
      if (this.invalid !== val) {
        this.$emit('validity', !val);
      }
      this.invalid = val;
    },
    clearIdleTimeout() {
      if (this.idleTimeout) {
        clearTimeout(this.idleTimeout);
        this.idleTimeout = null;
      }
    },
    onBlurOverride() {
      this.onBlur();
      this.clearIdleTimeout();
      if (this.$refs.input) {
        this.updateInvalid(!this.$refs.input.checkValidity());
      }
    },
    onInputOverride() {
      this.onInput();
      this.clearIdleTimeout();
      const invalid = !this.$refs.input.checkValidity();
      if (!invalid) {
        this.updateInvalid(false);
      } else {
        this.idleTimeout = setTimeout(() => {
          this.idleTimeout = null;
          this.updateInvalid(true);
        }, 1500);
      }
    },
  },
};
</script>

<style>
.text-field__box {
  height: 54px;

  &.focused {
    box-shadow: inset 2px 0 0 0 var(--theme-primary);

    & .text-field__label {
      color: var(--theme-primary);
    }

    & .text-field__input {
      &, &::placeholder {
        color: var(--theme-disabled);
      }
    }
  }

  &.active {
    & .text-field__label {
      color: var(--theme-secondary);
    }

    & .text-field__input {
      color: var(--theme-primary);
    }
  }

  &.disabled {
    & .text-field__label, & .text-field__count {
      color: var(--theme-disabled);
    }
  }

  .invalid & {
    box-shadow: inset 2px 0 0 0 var(--color-ketchup-30);

    &.active .text-field__label {
      color: var(--color-ketchup-30);
    }
  }
}

.text-field__input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex: 1;

  &:first-child {
    margin-left: 12px;
  }
}

.text-field__input {
  @mixin micro1;

  &.show-label {
    @mixin lil1;
  }
}

.text-field__hint {
  display: none;
  height: 22px;
  margin-top: 4px;
  padding: 0 8px;
  color: var(--theme-disabled);

  .invalid & {
    color: var(--color-ketchup-30);
  }

  .show-hint & {
    display: block;
  }
}

.text-field__count, .text-field__right-slot {
  margin-right: 12px;
}

.text-field__count {
  color: var(--theme-secondary);
}
</style>
