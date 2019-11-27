<template>
  <div class="form shadow1" :class="cls">
    <header class="form__header shadow1">
      <div class="form__header__info">
        <h5 class="form__header__title">{{title}}</h5>
        <div class="form__header__subtitle micro2">{{subtitle}}</div>
      </div>
      <button class="btn-icon form__header__menu" title="Open menu"
              @click="$emit('menu', $event)">
        <svgicon name="menu" ref="orig"/>
      </button>
      <button class="btn btn-square btn-water-cheese form__header__approve" title="Approve"
              @click="$emit('submit')" :disabled="disableSubmit">
        <svgicon name="v"/>
      </button>
    </header>
    <div class="form__content">
      <slot></slot>
    </div>
    <svgicon name="menu" class="form__menu--duplicate" ref="dup" v-if="menuOpened"/>
  </div>
</template>

<script>
export default {
  name: 'DmForm',

  props: {
    title: String,
    subtitle: String,
    menuOpened: {
      type: Boolean,
      default: false,
    },
    disableSubmit: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    cls() {
      return {
        'menu-opened': this.menuOpened,
      };
    },
  },

  watch: {
    menuOpened() {
      if (this.menuOpened) {
        this.$nextTick(() => {
          const parentRect = this.$el.getBoundingClientRect();
          const childRect = this.$refs.orig.$el.getBoundingClientRect();

          this.$refs.dup.$el.style.top = `${childRect.top - parentRect.top}px`;
          this.$refs.dup.$el.style.left = `${childRect.left - parentRect.left}px`;
          this.$refs.dup.$el.style.width = `${childRect.width}px`;
          this.$refs.dup.$el.style.height = `${childRect.height}px`;
        });
      }
    },
  },

  mounted() {
    import('@daily/components/icons/menu');
    import('@daily/components/icons/v');
  },
};
</script>

<style>
.form {
  position: relative;
  border-radius: 8px;
  background: var(--theme-background-highlight);
  overflow: hidden;

  &.menu-opened {
    pointer-events: none;

    & > .form__header, & > .form__content {
      opacity: 0.4;
    }
  }
}

.form__content {
  padding: 16px;
}

.form__header {
  display: flex;
  height: 64px;
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid var(--theme-background-primary);
}

.form__header__info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.form__header__title, .form__header__subtitle {
  text-overflow: ellipsis;
  overflow: hidden;
}

.form__header__title {
  color: var(--theme-primary);
}

.form__header__subtitle {
  color: var(--theme-secondary);
}

.form__header__menu {
  & .svg-icon {
    width: 26px;
    height: 26px;
  }
}

.form__header__approve {
  margin-left: 16px;
}

.form__menu--duplicate {
  position: absolute;
  color: var(--theme-primary);
}
</style>
