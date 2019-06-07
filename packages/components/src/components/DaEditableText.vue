<template>
  <div class="editable">
    <button class="btn btn-menu editable__non-active"
            @click.prevent="activate" v-if="!active">
      <svgicon :name="icon" class="editable__non-active__icon"/>
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
    icon: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
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
      value: null,
    };
  },

  computed: {
    nonActiveText() {
      if (this.valueAsText && this.value && this.value.length) {
        return this.value;
      }
      return this.text;
    },
  },

  methods: {
    activate() {
      this.active = true;
      this.$nextTick(() => {
        this.updateFormValidity();

        if (!this.resetOnSubmit && this.value) {
          this.$refs.input.value = this.value;
        }

        this.$refs.input.focus();
      });
    },

    cancel() {
      this.active = false;
    },

    submit() {
      this.value = this.$refs.input.value;
      this.$emit('submit', this.value);
      this.active = false;
    },

    updateFormValidity() {
      this.disableSubmit = !this.$refs.form.checkValidity();
    },
  },
};
</script>

<style>
.editable {
  height: 44px;

  & .btn, & .editable__active {
    @mixin micro1;
  }

  & .btn {
    text-transform: none;
  }

  & .editable__non-active, & .editable__active {
    width: 100%;
    height: 100%;
    padding: 0 16px;
  }

  & .editable__non-active {
    --button-color: var(--theme-secondary);

    & span {
      overflow: hidden;
      margin-left: 8px;
      flex: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: start;
    }
  }

  & .editable__cancel {
    margin-left: -3px;

    & .svg-icon {
      width: 20px;
      height: 20px;
    }
  }

  &.big {
    & .editable__non-active, & .editable__active {
      padding: 0 8px;

      --button-border-radius: 8px;
    }

    & .editable__non-active__icon {
      width: 30px;
      height: 30px;
    }

    & .editable__cancel {
      & .svg-icon {
        width: 24px;
        height: 24px;
      }
    }

    & .editable__input {
      margin: 0 16px;
    }
  }
}

.editable__input {
  width: 100%;
  flex: 1;
  margin: 0 8px;
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
