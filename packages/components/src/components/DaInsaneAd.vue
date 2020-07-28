<template>
  <div class="post post-ad insane" :class="cls">
    <div class="post__vseparator post__vmargin"></div>
    <div class="insane__main">
      <a class="post__link" :href="ad.link" target="_blank" rel="noopener noreferrer"
         :title="ad.description" @click="onClick">
        <div class="post__title lil1 multiline-text-overflow">{{ad.description}}</div>
        <div class="post__metadata">Promoted</div>
      </a>
    </div>
    <img v-for="(item, index) in pixel" :key="index" :src="item" class="post__pixel"/>
  </div>
</template>

<script>
import adMixin from '../common/adMixin';

export default {
  name: 'DaInsaneAd',
  mixins: [adMixin],
};
</script>

<style>
.insane.post-ad {
  & .post__vseparator {
    margin-left: 56px;
  }

  & .post__metadata {
    margin: 10px 0;
  }
}
</style>
