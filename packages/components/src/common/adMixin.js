export default {
  props: {
    ad: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    pixel() {
      return this.ad.pixel || [];
    },

    promoted() {
      if (this.ad.company) {
        return `/* Promoted by ${this.ad.company} */`;
      }

      return '/* Promoted */';
    },
  },

  methods: {
    truncatePromoted(text, maxLength) {
      const fallback = '/* Promoted */';
      if (fallback.length < maxLength) {
        return fallback;
      }
      return '';
    },

    onClick() {
      this.$emit('click', this.ad);
    },
  },

  mounted() {
    this.$emit('impression', this.ad);
  },
};
