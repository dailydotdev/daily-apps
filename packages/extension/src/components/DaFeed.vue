<template>
  <div class="feed">
    <div class="feed__insane" v-if="insaneMode">
      <template v-if="showAd">
        <da-insane-placeholder v-if="!ads.length"/>
        <da-insane-ad v-for="(item, index) in ads" :key="index" :ad="item"
                      @click="onAdClick" @impression="onAdImpression"/>
      </template>
      <da-insane-post v-for="item in posts" ref="posts" :key="item.id" :post="item"
                      @bookmark="onBookmark" @publication="onPublication" @menu="onPostMenu"
                      @click="onPostClick" :show-menu="isLoggedIn"
                      :menu-opened="selectedPostId === item.id"/>
    </div>
    <masonry class="feed__cards" :cols="cols" :gutter="32" v-else>
      <template v-if="showAd">
        <da-card-placeholder v-if="!ads.length"/>
        <da-card-ad v-for="(item, index) in ads" :key="index" :ad="item"/>
      </template>
      <da-card-post v-for="item in posts" ref="posts" :key="item.id" :post="item"
                    @bookmark="onBookmark" @publication="onPublication" @menu="onPostMenu"
                    @click="onPostClick" :show-menu="isLoggedIn"
                    :menu-opened="selectedPostId === item.id"/>
    </masonry>
    <da-context ref="context" class="feed__context" @open="onPostMenuOpened"
                @close="selectedPostId = null">
      <button class="btn btn-menu" @click="reportPost('broken')">Broken link</button>
      <button class="btn btn-menu" @click="reportPost('nsfw')">Report NSFW</button>
      <button class="btn btn-menu" @click="hidePost">Hide post</button>
    </da-context>
  </div>
</template>

<script>
import Vue from 'vue';
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import VueMasonry from 'vue-masonry-css';
import { monetizationService, contentService } from '../common/services';

Vue.use(VueMasonry);

export default {
  name: 'DaFeed',
  components: {
    DaCardPost: () => import(/* webpackChunkName: "cards" */ '@daily/components/src/components/DaCardPost.vue'),
    DaCardAd: () => import(/* webpackChunkName: "cards" */ '@daily/components/src/components/DaCardAd.vue'),
    DaCardPlaceholder: () => import(/* webpackChunkName: "cards" */ '@daily/components/src/components/DaCardPlaceholder.vue'),
    DaInsanePost: () => import(/* webpackChunkName: "insane" */ '@daily/components/src/components/DaInsanePost.vue'),
    DaInsaneAd: () => import(/* webpackChunkName: "insane" */ '@daily/components/src/components/DaInsaneAd.vue'),
    DaInsanePlaceholder: () => import(/* webpackChunkName: "insane" */ '@daily/components/src/components/DaInsanePlaceholder.vue'),
    DaContext: () => import('@daily/components/src/components/DaContext.vue'),
  },
  data() {
    return {
      selectedPostId: null,
      ads: [],
      cols: {
        default: 7,
        2350: 6,
        2030: 5,
        1670: 4,
        1390: 3,
        1070: 2,
      },
    };
  },
  computed: {
    ...mapState('ui', ['insaneMode']),
    ...mapGetters({
      posts: 'feed/feed',
      showAd: 'feed/showAd',
      isLoggedIn: 'user/isLoggedIn',
    }),
  },
  watch: {
    showAd(value) {
      if (value) {
        this.fetchAd();
      }
    },
  },
  methods: {
    onAdClick(ad) {
      ga('send', 'event', 'Ad', 'Click', ad.source);
    },

    onAdImpression(ad) {
      ga('send', 'event', 'Ad', 'Impression', ad.source);
    },

    onBookmark({ post, bookmarked }) {
      ga('send', 'event', 'Post', 'Bookmark', bookmarked ? 'Add' : 'Remove');
      this.toggleBookmarks({ id: post.id, bookmarked });
    },

    onPublication({ pub }) {
      if (this.filter && this.filter.type === 'publication' && this.filter.info.id === pub.id) return;
      ga('send', 'event', 'Post', 'Publication');
      this.setFilter({ type: 'publication', info: pub });
    },

    onPostClick(post) {
      ga('send', 'event', 'Post', 'Click', post.source);
    },

    onPostMenu({ post, event }) {
      ga('send', 'event', 'Post', 'Menu');
      this.$refs.context.open(event, post);
    },

    onPostMenuOpened(event, post) {
      const rect = event.target.getBoundingClientRect();
      this.$refs.context.positionMenu({ bottom: rect.top - 8, right: rect.right });
      this.selectedPostId = post.id;
    },

    reportPost(reason) {
      ga('send', 'event', 'Post', 'Report', reason);
      const postId = this.selectedPostId;
      this.$refs.context.close();

      // TODO: handle error
      contentService.reportPost(postId, reason)
      // eslint-disable-next-line no-console
        .catch(console.error);

      setTimeout(() => {
        this.$refs.posts.find(com => com.post.id === postId).notify('Thanks for reporting!');
        setTimeout(() => this.removePost(postId), 1000);
      }, 100);
    },

    hidePost() {
      ga('send', 'event', 'Post', 'Hide');
      const postId = this.selectedPostId;
      this.$refs.context.close();

      // TODO: handle error
      contentService.hidePost(postId)
      // eslint-disable-next-line no-console
        .catch(console.error);

      this.removePost(postId);
    },

    async fetchAd() {
      this.ads = [];
      try {
        this.ads = await monetizationService.fetchAd();
        if (!this.ads.length) {
          ga('send', 'event', 'Ad', 'NotAvailable');
        }
      } catch (err) {
        // TODO: handle error
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },

    ...mapActions({
      setFilter: 'feed/setFilter',
    }),

    ...mapMutations({
      removePost: 'feed/removePost',
      toggleBookmarks: 'feed/toggleBookmarks',
    }),
  },

  mounted() {
    if (this.showAd) {
      this.fetchAd();
    }
  },
};
</script>

<style>
.feed__insane {
  border-radius: 8px;
  overflow: hidden;
}

.feed__cards {
  margin: -32px 0;

  & .card, & .card-ph {
    margin: 32px 0;
  }
}
</style>
