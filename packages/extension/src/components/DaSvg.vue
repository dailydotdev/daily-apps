<template>
  <div class="svg"></div>
</template>

<script>
export default {
  name: 'DaSvg',
  props: {
    src: {
      type: String,
      required: true,
    },
  },

  watch: {
    async src() {
      await this.reload();
    },
  },

  methods: {
    async reload() {
      const res = await fetch(this.src);
      this.$el.innerHTML = await res.text();
    },
  },

  async mounted() {
    await this.reload();
  },
};
</script>
