<template>
  <div class="insane insane--ad">
    <a :href="ad.link" target="_blank" class="insane__link" @click="$emit('click')">
      <h5 class="insane__title">{{ad.description | cardTitle}}</h5>
    </a>
    <span class="insane__promoted micro2">/# {{ promoted }} #/</span>
    <img v-for="(item, index) in pixel" :key="index" :src="item" class="insane__pixel"/>
  </div>
</template>

<script>
export default {
  name: 'DaInsandeAd',
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
    this.$emit('impression');
  },
};
</script>

<style>
.insane__promoted {
  color: var(--theme-secondary);
  text-transform: uppercase;
}

.insane__pixel {
  display: none;
  width: 0;
  height: 0;
}
</style>
