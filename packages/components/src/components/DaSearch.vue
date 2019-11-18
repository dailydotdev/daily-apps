<template>
  <div class="search" :class="{focused, disabled, autocomplete: showAutocomplete}"
       @click="$refs.input.focus()">
    <div class="search__container">
      <svgicon name="magnifying" class="search-icon"/>
      <form @submit.prevent="onSubmit">
        <input class="search__input micro1" type="text" ref="input"
               :placeholder="inputPlaceholder" :aria-label="label" :disabled="disabled"
               @focus="focused=true" @blur="onBlur" @input="onInput"
               @keydown="onKeyDown">
      </form>
      <button class="btn-icon btn-tiny" v-show="hasInput" @click="clearInput">
        <svgicon name="x"/>
      </button>
    </div>
    <ul role="listbox" class="search__autocomplete" ref="listbox"
        v-if="focused && suggestions.length">
      <li role="option" v-for="(item, index) in suggestions" :key="item.title"
          class="search__option btn btn-menu" :class="{selected: index + 1 === selectedSuggestion}"
          :aria-selected="index + 1 === selectedSuggestion"
          @click="onSuggestionClick(index)" @mousedown.prevent="onMouseDown">
        <svgicon name="magnifying" class="search-icon"/>
        <span v-html="purify(item.title)"></span>
      </li>
      <slot name="autocomplete"></slot>
    </ul>
  </div>
</template>

<script>
import createDOMPurify from 'dompurify';

export default {
  name: 'DaSearch',

  props: {
    placeholder: String,
    label: String,
    disabled: Boolean,
    autofocus: Boolean,
    suggestions: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      focused: false,
      selectedSuggestion: 0,
      hasInput: false,
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
    showAutocomplete() {
      return this.suggestions.length > 0;
    },
  },

  watch: {
    suggestions() {
      this.selectedSuggestion = 0;
    },
    selectedSuggestion() {
      if (this.selectedSuggestion !== null) {
        this.updateInputWithSuggestion();
      }
    },
  },

  methods: {
    purify(html) {
      return this.DOMPurify.sanitize(html);
    },
    query() {
      return this.$refs.input.value;
    },
    focus() {
      this.$refs.input.focus();
    },
    onInput() {
      this.currentInput = this.$refs.input.value;
      this.$emit('input', this.$refs.input.value);
      this.hasInput = this.$refs.input.value.length > 0;
    },
    onBlur() {
      this.focused = false;
      this.$emit('blur');
    },
    onKeyDown(event) {
      if (event.keyCode === 40 || event.keyCode === 38) {
        event.preventDefault();
        const children = this.$refs.listbox.querySelectorAll('li');
        const n = children.length + 1;
        if (this.selectedSuggestion !== null) {
          const step = event.keyCode === 40 ? 1 : -1;
          // positive modulo
          this.selectedSuggestion = (((this.selectedSuggestion + step) % n) + n) % n;
        } else {
          this.selectedSuggestion = event.keyCode === 40 ? 0 : (n - 1);
        }
      }
    },
    onMouseDown() {
      // Prevent from blurring the input
    },
    onSuggestionClick(index) {
      this.$refs.input.focus();
      this.selectedSuggestion = index + 1;
      this.updateInputWithSuggestion();
      this.onSubmit();
    },
    onSubmit() {
      this.currentInput = this.$refs.input.value;
      this.$emit('submit', this.$refs.input.value);
    },
    clearInput() {
      this.$refs.input.value = '';
      this.onInput();
    },
    updateInputWithSuggestion() {
      if (this.selectedSuggestion) {
        const children = this.$refs.listbox.querySelectorAll('li');
        this.$refs.input.value = children[this.selectedSuggestion - 1].innerText;
      } else {
        this.$refs.input.value = this.currentInput;
      }
    },
  },

  created() {
    this.DOMPurify = createDOMPurify(window);
  },

  mounted() {
        import('../../icons/magnifying');
        import('../../icons/x');
  },
};
</script>

<style>
.search {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  z-index: 2;

  &.autocomplete {
    overflow: visible;
  }

  &.focused {
    & .search__input::placeholder {
      color: var(--theme-disabled);
    }

    & .search__input, & .search-icon {
      color: var(--theme-primary);
    }
  }

  &.disabled {
    cursor: unset;
    pointer-events: none;

    .search__input, .search__input::placeholder, .search-icon {
      color: var(--theme-disabled);
    }
  }

  &.border {
    & .search__container {
      border: 1px solid var(--theme-primary);
    }

    &.disabled {
      & .search__container {
        border-color: var(--theme-disabled);
      }
    }
  }

  &.border, &.float {
    background: transparent;

    &:hover:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: var(--theme-hover);
      opacity: var(--theme-hover-opacity);
    }
  }

  & form {
    flex: 1;
  }
}

.search__container {
  display: flex;
  height: 44px;
  flex-direction: row;
  align-items: center;
  background: var(--theme-background-highlight);
  border-radius: 8px;

  &:hover {
    background: var(--theme-light);

    & .search__input, & .search-icon {
      color: var(--theme-primary);
    }
  }
}

.search__container, .search__option.btn.btn-menu {
  padding: 0 8px;

  & > .svg-icon {
    margin-left: 0;
    margin-right: 4px;
  }
}

.search__input, .search__input::placeholder, .search-icon {
  color: var(--theme-secondary);
}

.search-icon {
  width: 30px;
  height: 30px;
  padding: 3px;
}

.search__input {
  width: 100%;
  min-width: 0;
  margin: 0;
  background: none;
  border: none;
  outline: 0;
  caret-color: var(--color-water-60);
}

.search__autocomplete {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 36px;
  width: 100%;
  flex-direction: column;
  margin: 0;
  padding: 8px 0;
  background: var(--theme-background-highlight);
  border-radius: 0 0 8px 8px;
  z-index: -1;
  box-shadow: 0 var(--theme-shadow-offset) 32px 8px rgba(0, 0, 0, 0.32);
  list-style-type: none;

  .search.autocomplete & {
    display: flex;
  }

  &:focus {
    outline: none;
  }
}

.search__option.btn.btn-menu {
  display: flex;
  width: 100%;
  height: 40px;
  flex-direction: row;
  align-items: center;
  text-transform: none;

  @mixin micro1;

  & > strong {
    margin: 0;
  }

  & .search-icon {
    color: var(--theme-secondary);
  }

  & span {
    overflow: hidden;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
