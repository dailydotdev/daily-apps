<template>
  <div
    class="search-field"
    :class="{focused, disabled, active: hasInput}"
    @click="$refs.input.focus()"
  >
    <svgicon :name="icon" class="search-field__icon" />
    <input
      class="search-field__input micro1"
      type="text"
      ref="input"
      :placeholder="inputPlaceholder"
      :aria-label="label"
      :disabled="disabled"
      @focus="focused=true"
      @blur="focused=false"
      @input="onInput"
    />
    <button class="search-field__clear btn-icon btn-tiny" v-show="hasInput" @click="clearInput">
      <svgicon name="x" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'DaSearchField',

  props: {
    icon: String,
    placeholder: String,
    label: String,
    disabled: Boolean,
    autofocus: Boolean,
  },

  data() {
    return {
      focused: false,
      currentInput: null,
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
      return !this.disabled && this.currentInput && this.currentInput.length;
    },
  },

  methods: {
    onInput() {
      this.currentInput = this.$refs.input.value;
    },
    clearInput() {
      this.$refs.input.value = '';
      this.onInput();
    },
  },

  mounted() {
    import(`../../icons/${this.icon}`);
    import('../../icons/x');
  },
};
</script>

<style>
.search-field {
  position: relative;
  display: flex;
  height: 44px;
  padding: 0 4px;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: var(--theme-hover);
    opacity: var(--theme-hover-opacity);
  }

  & > * {
    margin: 0 4px;
  }

  &:hover {
    &:before {
      background: var(--theme-focus);
      opacity: var(--theme-focus-opacity);
    }

    & .search-field__input::placeholder {
      color: var(--theme-primary);
    }

    & .search-field__icon {
      color: var(--theme-primary);
    }
  }

  &.focused,
  &.active {
    &:before {
      background: var(--theme-active);
      opacity: var(--theme-active-opacity);
    }

    & .search-field__input::placeholder {
      color: var(--theme-secondary);
    }

    & .search-field__icon {
      color: var(--theme-primary);
    }
  }

  &.disabled {
    pointer-events: none;

    & .search-field__input {
      &, &::placeholder {
        color: var(--theme-disabled);
      }
    }

    & .search-field__icon {
      color: var(--theme-disabled);
    }
  }

  &.border {
    border: 1px solid var(--theme-secondary);

    &:hover, &.focused, &.active {
      border-color: var(--theme-primary);
    }

    &.disabled {
      border-color: var(--theme-disabled);
    }
  }

  &.border, &.float {
    &:before {
      background: none;
    }

    &:hover:before {
      background: var(--theme-hover);
      opacity: var(--theme-hover-opacity);
    }
  }
}

.search-field__input {
  min-width: 0;
  margin: 0;
  background: none;
  border: none;
  outline: 0;
  color: var(--theme-primary);
  caret-color: var(--color-water-60);
  flex: 1;

  &::placeholder {
    color: var(--theme-secondary);
  }

  &:focus {
    outline: 0;
  }
}

.search-field__icon {
  width: 30px;
  height: 30px;
  padding: 3px;
  color: var(--theme-secondary);
}
</style>
