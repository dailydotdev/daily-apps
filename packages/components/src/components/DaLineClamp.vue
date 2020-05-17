<template>
  <span ref="content" :title="text"></span>
</template>

<script>
import { debounce } from 'debounce';

const elements = [];
window.addEventListener('resize', debounce(() => {
  elements.forEach(el => el.updateText());
}, 400));

const ellipsis = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substr(0, maxLength - 3)}...`;
};

export default {
  name: 'DaLineClamp',

  data() {
    return {
      offset: 0,
    };
  },

  props: {
    text: {
      type: String,
      required: true,
    },
    lines: {
      type: Number,
      default: 1,
    },
    lineHeight: {
      type: Number,
      default: 20,
    },
    truncate: {
      type: Function,
      default: ellipsis,
    },
  },

  watch: {
    text() {
      this.updateHtml();
      this.updateText();
    },
  },

  methods: {
    isOverflow() {
      const rect = this.$refs.content.getBoundingClientRect();
      return (this.lines * this.lineHeight - rect.height) < 0;
    },

    updateText() {
      let i = 1;
      if (this.offset) {
        while (!this.isOverflow() && this.offset > 0) {
          this.offset -= i * 2;
          i += 1;
          this.updateHtml();
        }
        if (this.offset < 0) {
          this.offset = 0;
          this.updateHtml();
        }
      }

      i = 1;
      while (this.isOverflow() && this.offset < this.text.length) {
        this.offset += i * 2;
        i += 1;
        this.updateHtml();
      }
      if (this.offset > this.text.length) {
        this.offset = this.text.length;
        this.updateHtml();
      }
    },

    updateHtml() {
      if (!this.offset) {
        this.$refs.content.textContent = this.text;
      } else {
        this.$refs.content.textContent = this.truncate(this.text, this.text.length - this.offset);
      }
    },
  },

  mounted() {
    elements.push(this);
    this.updateHtml();
    this.updateText();
  },

  beforeDestroy() {
    const index = elements.indexOf(this);
    if (index > -1) {
      elements.splice(index, 1);
    }
  },
};
</script>
