<template>
  <div class="insane insane--ad">
    <a :href="ad.link" target="_blank" class="insane__link" @click="$emit('click', ad)">
      <h5 class="insane__title">
        <da-line-clamp :text="ad.description" :lines="3"/>
      </h5>
    </a>
    <a class="insane__promoted micro2" target="_blank"
       :href="ad.referralLink" v-if="ad && ad.referralLink">{{ promoted }}</a>
    <span class="insane__promoted micro2" v-else>{{ promoted }}</span>
    <img v-for="(item, index) in pixel" :key="index" :src="item" class="insane__pixel"/>
  </div>
</template>

<script>
import DaLineClamp from './DaLineClamp.vue';
import adMixin from '../common/adMixin';

export default {
  name: 'DaInsandeAd',
  mixins: [adMixin],
  components: {
    DaLineClamp,
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

.insane--ad.hover {
  border: 1px solid #2A76D2;
  border-radius: 8px 8px 0px 0px;

  & .insane__link {
    outline: none;
  }
}
</style>
