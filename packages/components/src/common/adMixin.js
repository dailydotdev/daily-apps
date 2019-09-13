export default {
  props: {
    ad: {
      type: Object,
      required: true,
    },
  },

  computed: {
    pixel() {
      return this.ad.pixel || [];
    },

    promoted() {
      if (this.ad.company) {
        return `Promoted by ${this.ad.company}`;
      }

      return 'Promoted';
    },
  },

  mounted() {
    this.$emit('impression', this.ad);
  },
};
