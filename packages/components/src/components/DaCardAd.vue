<template>
  <div class="post card post-ad" :class="cls">
    <a class="post__link" :href="ad.link" target="_blank" rel="noopener noreferrer"
       :title="ad.description" @click="onClick" @click.middle="onClick">
      <div class="post__title card__hmargin lil1 multiline-text-overflow">{{ad.description}}</div>
      <div class="card__image post__vmargin" :style="imgStyle">
        <img :data-src="ad.image" :data-lowsrc="ad.placeholder" alt="Ad image"
             class="lazyload main"/>
        <img :data-src="ad.image" :data-lowsrc="ad.placeholder" alt="Ad background image"
             class="lazyload blur" v-if="ad.source === 'Carbon'"/>
      </div>
    </a>
    <div class="post__metadata card__hmargin">
      <a v-if="isCarbon" :href="ad.referralLink"
         target="_blank" rel="noopener noreferrer">Promoted by Carbon</a>
      <span v-else>Promoted</span>
      <button @click="onRemoveAds">Remove ads?</button>
    </div>
    <img v-for="(item, index) in pixel" :key="index" :src="item" class="post__pixel"/>
  </div>
</template>

<script>
import 'lazysizes/plugins/blur-up/ls.blur-up';
import 'lazysizes';
import adMixin from '../common/adMixin';

export default {
  name: 'DaCardAd',
  mixins: [adMixin],

  computed: {
    cls() {
      return {
        [this.ad.source]: this.ad.source,
        hover: this.selected,
      };
    },

    imgStyle() {
      return {
        background: this.ad.backgroundColor,
      };
    },
  },
};
</script>

<style>
.card.post-ad {
  & .post__title {
    margin-top: 16px;
  }

  & .card__image {
    position: relative;
    margin-top: auto;
  }

  &.Carbon .card__image {
    & .main {
      object-fit: contain;
    }

    & .blur {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      filter: blur(20px);
    }
  }

  & .post__metadata {
    justify-content: space-between;
  }
}
</style>
