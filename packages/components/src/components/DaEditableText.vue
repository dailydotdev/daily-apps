<template>
  <div class="editable">
    <button class="btn btn-menu editable__non-active"
            @click.prevent="activate" v-if="!active">
      <div class="editable__icon-container" v-if="icon">
        <svgicon :name="icon" class="editable__non-active__icon"/>
      </div>
      <span>{{nonActiveText}}</span>
    </button>
    <form class="btn btn-menu selected editable__active" v-else
          @click.prevent="$refs.input && $refs.input.focus()" ref="form">
      <button type="button" class="btn-icon editable__cancel" @click="cancel">
        <svgicon name="x"/>
      </button>
      <input class="editable__input" :type="type" :placeholder="placeholder" :required="required"
             ref="input" @input="updateFormValidity">
      <button type="submit" class="editable__submit btn btn-square btn-invert"
              :disabled="disableSubmit" @click.prevent="submit">
        <svgicon name="v" class="invert"/>
      </button>
      <slot></slot>
    </form>
  </div>
</template>

<script>
export default {
  name: 'DaEditableText',

  props: {
    icon: String,
    text: String,
    value: String,
    type: {
      type: String,
      default: 'text',
    },
    placeholder: String,
    resetOnSubmit: {
      type: Boolean,
      default: false,
    },
    valueAsText: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      active: false,
      disableSubmit: true,
      realValue: this.value,
    };
  },

  watch: {
    value() {
      this.realValue = this.value;
    },
  },

  computed: {
    nonActiveText() {
      if (this.valueAsText && this.realValue && this.realValue.length) {
        return this.realValue;
      }
      return this.text;
    },
  },

  methods: {
    activate() {
      this.active = true;
      this.$nextTick(() => {
        if (!this.resetOnSubmit && this.realValue) {
          this.$refs.input.value = this.realValue;
        }
        this.updateFormValidity();
        this.$refs.input.focus();
      });
    },

    cancel() {
      this.active = false;
    },

    submit() {
      this.realValue = this.$refs.input.value.length ? this.$refs.input.value : null;
      this.$emit('submit', this.realValue);
      this.active = false;
    },

    updateFormValidity() {
      this.disableSubmit = !this.$refs.form.checkValidity();
    },
  },

  mounted() {
    import('../../icons/x');
    import('../../icons/v');
  },
};
</script>

<style>
.editable {
  height: 44px;

  & .btn, & .editable__active, & .editable__input {
    @mixin micro1;
  }

  & .btn {
    text-transform: none;
  }

  & .editable__non-active, & .editable__active {
    width: 100%;
    height: 100%;
    padding: 0 8px;

    --button-border-radius: 8px;
  }

  & .editable__non-active {
    --button-color: var(--theme-secondary);

    & span {
      overflow: hidden;
      flex: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: start;

      &:first-child {
        margin-left: 0;
      }
    }
  }
}

.editable__input, .editable__non-active span {
  margin: 0 16px;
}

.editable__icon-container {
  display: flex;
  padding: 3px;
}

.editable__input {
  width: 100%;
  flex: 1;
  color: var(--theme-primary);
  background: none;
  border: none;
  caret-color: var(--color-water-60);
  min-width: 0;

  &:focus {
    outline: 0;
  }

  &::placeholder {
    color: var(--theme-secondary);
  }
}
</style>
