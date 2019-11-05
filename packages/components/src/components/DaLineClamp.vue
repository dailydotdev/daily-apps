<template>
  <span ref="content" :aria-label="text"></span>
</template>

<script>
const elements = [];
window.addEventListener('resize', () => {
  elements.forEach(el => el.updateText());
});

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
        while (!this.isOverflow() && this.offset) {
          this.offset -= i * 2;
          i += 1;
          this.updateHtml();
        }
      }

      i = 1;
      while (this.isOverflow()) {
        this.offset += i * 2;
        i += 1;
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
