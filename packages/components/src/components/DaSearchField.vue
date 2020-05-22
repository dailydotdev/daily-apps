<template>
  <div
    class="search-field field"
    :class="{focused, disabled, active}"
    @click="focusInput"
  >
    <svgicon :name="icon" class="field__icon" />
    <input
      class="search-field__input micro1"
      type="text"
      ref="input"
      :placeholder="inputPlaceholder"
      :aria-label="label"
      :disabled="disabled"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
    />
    <button class="btn-icon btn-tiny" v-show="active" @click="clearInput">
      <svgicon name="x" />
    </button>
  </div>
</template>

<script>
import textFieldMixin from '../common/textFieldMixin';

export default {
  name: 'DaSearchField',
  mixins: [textFieldMixin],

  props: {
    icon: String,
  },

  mounted() {
    import(`../../icons/${this.icon}`);
    import('../../icons/x');
  },
};
</script>

<style>
.search-field {
  height: 44px;

  &:hover {
    & .search-field__input::placeholder {
      color: var(--theme-primary);
    }

    & .field__icon {
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

    & .field__icon {
      color: var(--theme-primary);
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
  color: var(--theme-primary);
  flex: 1;
}
</style>
