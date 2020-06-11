<template>
    <div class="dropdown" @keydown="onKeyDown"
        :class="{ 'has-selection': hasSelection, opened }">
      <button ref="trigger" class="btn selectable dropdown__trigger" aria-haspopup="listbox"
              :aria-label="triggerLabel" :aria-expanded="opened"
              :autofocus="autofocus" :disabled="disabled"
              @click="triggerClick">
        <span>{{ triggerText }}</span>
        <svgicon name="arrow" />
      </button>
      <ul v-if="opened" ref="menu" role="listbox" :aria-label="label"
        class="dropdown__menu scrollbar" tabindex="-1" @blur="menuBlur">
        <li v-for="(item, index) in items" ref="opts" :key="item.value" role="option"
            class="btn selectable" :aria-selected="index === dSelectedIndex"
            @click="optionClick(index)">
          <span>{{ item.text }}</span>
          <svgicon name="v" />
        </li>
      </ul>
    </div>
</template>

<script>
import '../../icons/arrow';
import '../../icons/v';

const UP = 38;
const DOWN = 40;
const ENTER = 13;
const HOME = 36;
const END = 35;

export default {
  name: 'DaDropdown',

  props: {
    autofocus: Boolean,
    disabled: Boolean,
    label: String,
    placeholder: String,
    items: Array,
    selectedIndex: {
      type: Number,
      default: -1,
    },
  },

  data() {
    return {
      dSelectedIndex: this.selectedIndex,
      opened: false,
      keysSoFar: '',
      keyClear: null,
      searchIndex: null,
      blurring: false,
    };
  },

  computed: {
    hasSelection() {
      return this.dSelectedIndex > -1;
    },

    triggerLabel() {
      if (this.hasSelection) {
        return `${this.label} ${this.triggerText}`;
      }
      return this.label;
    },

    triggerText() {
      if (this.hasSelection) {
        return this.items[this.dSelectedIndex].text;
      }
      return this.placeholder;
    },
  },

  watch: {
    async opened(val) {
      if (val) {
        this.searchIndex = null;
        await this.$nextTick();
        this.$refs.menu.focus();
        if (this.hasSelection) {
          this.scrollToElement();
        }
      } else {
        await this.$nextTick();
        this.$refs.trigger.focus();
      }
    },
    async dSelectedIndex(val) {
      if (val > -1) {
        await this.$nextTick();
        this.scrollToElement();
      }
      this.$emit('selected', val);
    },
  },

  methods: {
    triggerClick() {
      if (!this.opened && !this.blurring) {
        this.opened = true;
      } else if (this.blurring) {
        this.blurring = false;
      }
    },

    optionClick(index) {
      this.dSelectedIndex = index;
      this.opened = false;
    },

    menuBlur() {
      this.opened = false;
      this.blurring = true;
      setTimeout(() => {
        // Make sure blur is after trigger click
        this.blurring = false;
      }, 500);
    },

    scrollToElement() {
      const { menu } = this.$refs;
      if (!menu) {
        return;
      }
      const element = this.$refs.opts[this.dSelectedIndex];
      if (menu.scrollHeight > menu.clientHeight) {
        const scrollBottom = menu.clientHeight + menu.scrollTop;
        const elementBottom = element.offsetTop + element.offsetHeight;
        if (elementBottom > scrollBottom) {
          menu.scrollTop = elementBottom - menu.clientHeight;
        } else if (element.offsetTop < menu.scrollTop) {
          menu.scrollTop = element.offsetTop;
        }
      }
    },

    onKeyDown(event) {
      const key = event.which || event.keyCode;
      switch (key) {
        case ENTER:
          event.preventDefault();
          this.opened = !this.opened;
          break;
        case UP:
          event.preventDefault();
          this.moveSelectedIndex(-1);
          break;
        case DOWN:
          event.preventDefault();
          this.moveSelectedIndex(1);
          break;
        case HOME:
          if (this.opened) {
            event.preventDefault();
            this.dSelectedIndex = 0;
          }
          break;
        case END:
          if (this.opened) {
            event.preventDefault();
            this.dSelectedIndex = this.items.length - 1;
          }
          break;
        default: {
          const itemToFocus = this.findItemToFocus(key);
          if (itemToFocus !== null) {
            event.preventDefault();
            this.dSelectedIndex = itemToFocus;
          }
          break;
        }
      }
    },

    moveSelectedIndex(dir) {
      const n = this.items.length;
      this.dSelectedIndex = (((this.dSelectedIndex + dir) % n) + n) % n;
      this.opened = true;
    },

    findItemToFocus(key) {
      const character = String.fromCharCode(key);

      if (this.searchIndex === null) {
        this.keysSoFar = '';
        this.searchIndex = this.dSelectedIndex > -1 ? this.dSelectedIndex : 0;
      }
      this.keysSoFar += character;
      this.clearKeysSoFarAfterDelay();

      let nextMatch = this.findMatchInRange(this.searchIndex, this.items.length);
      if (nextMatch === null) {
        nextMatch = this.findMatchInRange(0, this.searchIndex);
      }
      return nextMatch;
    },

    clearKeysSoFarAfterDelay() {
      if (this.keyClear) {
        clearTimeout(this.keyClear);
        this.keyClear = null;
      }
      this.keyClear = setTimeout(() => {
        this.searchIndex = null;
        this.keyClear = null;
      }, 500);
    },

    findMatchInRange(startIndex, endIndex) {
      for (let n = startIndex; n < endIndex; n += 1) {
        const label = this.items[n].text;
        if (label && label.toUpperCase().indexOf(this.keysSoFar) === 0) {
          return n;
        }
      }
      return null;
    },
  },
};
</script>

<style>
.dropdown {
  position: relative;

  &.has-selection .btn.dropdown__trigger {
    color: var(--theme-primary);
  }

  &.opened .btn.dropdown__trigger .svg-icon {
    color: var(--theme-primary);
    transform: none;
  }

  & .focus-visible li.btn[aria-selected] {
    --button-background: var(--theme-focus);
    --button-background-opacity: var(--theme-focus-opacity);
  }
}

.btn.dropdown__trigger, .dropdown__menu li.btn {
  width: 100%;
  height: 44px;
  padding: 0 8px 0 16px;
  text-transform: none;
  justify-content: space-between;
  --button-border-radius: 8px;

  & {
    @mixin micro1;
  }

  & span {
    overflow: hidden;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  & .svg-icon {
    width: 16px;
    height: 16px;
    margin: 0 2px;
  }
}

.btn.dropdown__trigger {
  --button-color: var(--theme-disabled);
  --button-background: var(--theme-hover);
  --button-background-opacity: var(--theme-hover-opacity);

  &:hover, &.hover {
    --button-background: var(--theme-focus);
    --button-background-opacity: var(--theme-focus-opacity);
    --button-color: var(--theme-primary);
  }

  &:active, &.active {
    --button-background: var(--theme-active);
    --button-background-opacity: var(--theme-active-opacity);
    --button-color: var(--theme-primary);
  }

  &[disabled] {
    --button-background: var(--theme-hover);
    --button-background-opacity: var(--theme-hover-opacity);
  }

  & .svg-icon {
    transform: rotate(180deg);
    transition: transform 0.1s linear;
  }
}

.dropdown__menu {
  position: absolute;
  width: 100%;
  background: var(--theme-background-highlight);
  max-height: 132px;
  margin: 4px 0 0;
  padding: 0;
  border-radius: 8px;
  color: var(--theme-primary);
  list-style: none;
  box-shadow: 0 16px 16px 0 rgba(0, 0, 0, 0.24);
  z-index: 1;
  outline: 0;
  overflow-y: auto;

  .bright & {
    box-shadow: 0 16px 16px 0 rgba(21, 22, 24, 0.08);
  }

  & li {
    --button-background: none;
    --button-background-opacity: 0;
    --button-color: var(--theme-primary);

    & .svg-icon {
      display: none;
    }

    &[disabled] {
      --button-color: var(--theme-disabled);
    }

    &:hover, &.hover {
      --button-background: var(--theme-hover);
      --button-background-opacity: var(--theme-hover-opacity);
    }

    &:active, &.active {
      --button-background: var(--theme-active);
      --button-background-opacity: var(--theme-active-opacity);
    }

    &[aria-selected] {
      font-weight: bold;

      & .svg-icon {
        display: block;
      }
    }
  }
}
</style>
