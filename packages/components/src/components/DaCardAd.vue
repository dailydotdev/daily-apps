<template>
  <div class="card card-ad" :class="cls">
    <a class="card__link" :href="ad.link" target="_blank" rel="noopener noreferrer"
       :title="ad.description" @click="onClick">
      <div class="card__title card__hmargin lil1">{{ad.description}}</div>
      <div class="card__image card__vmargin" :style="imgStyle">
        <img :data-src="ad.image" :data-lowsrc="ad.placeholder" alt="Ad image" class="lazyload"/>
      </div>
      <div class="card__metadata card__hmargin">Promoted</div>
    </a>
    <img v-for="(item, index) in pixel" :key="index" :src="item" class="card__pixel"/>
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
    size() {
      return this.ad.size || 'small';
    },

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
.card-ad {
  & .card__title {
    height: 80px;
    margin-top: 16px;
    -webkit-line-clamp: 4;
  }

  & .card__image {
    position: relative;
    margin-top: auto;
  }

  & .card__metadata {
    text-transform: uppercase;
  }

  &.BSA .card__image img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    max-width: 250px;
    max-height: 100px;
    margin: auto;
  }
}

.card__pixel {
  display: none;
  width: 0;
  height: 0;
}
</style>
