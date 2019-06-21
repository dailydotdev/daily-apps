<template>
  <div class="insane insane--ad">
    <a :href="ad.link" target="_blank" class="insane__link" @click="$emit('click', ad)">
      <h5 class="insane__title">
        <da-line-clamp :text="ad.description" :lines="3"/>
      </h5>
    </a>
    <a class="insane__promoted micro2" target="_blank"
       :href="ad.referralLink" v-if="ad && ad.referralLink">/* {{ promoted }} */</a>
    <span class="insane__promoted micro2" v-else>/* {{ promoted }} */</span>
    <img v-for="(item, index) in pixel" :key="index" :src="item" class="insane__pixel"/>
  </div>
</template>

<script>
import DaLineClamp from './DaLineClamp.vue';

export default {
  name: 'DaInsandeAd',

  components: {
    DaLineClamp,
  },

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
</script>

<style>
.insane__promoted {
  color: var(--theme-secondary);
  text-transform: uppercase;
  text-decoration: none;
}

.insane__pixel {
  display: none;
  width: 0;
  height: 0;
}
</style>
