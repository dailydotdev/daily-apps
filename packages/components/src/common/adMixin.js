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
    cls() {
      return {
        hover: this.selected,
      };
    },
  },

  methods: {
    onClick() {
      this.$emit('click', this.ad);
    },
    onRemoveAds() {
      this.$emit('remove-ads');
    },
  },

  mounted() {
    this.$emit('impression', this.ad);
  },
};
