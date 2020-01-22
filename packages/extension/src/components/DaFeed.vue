<template>
  <div class="feed" :class="spaciness">
    <div class="feed__insane" v-if="insaneMode">
      <template v-if="showAd">
        <da-insane-placeholder v-if="!ads.length"/>
        <da-insane-ad v-for="(item, index) in ads" :key="index" :ad="item" ref="posts"
                      @click="onAdClick" @impression="onAdImpression"/>
      </template>
      <da-insane-post v-for="item in posts" ref="posts" :key="item.id" :post="item"
                      @bookmark="onBookmark" @publication="onPublication" @menu="onPostMenu"
                      @click="onPostClick" :show-menu="isLoggedIn" :hover="focusedItemId === item.id"
                      :menu-opened="selectedPostId === item.id" />
    </div>
    <masonry class="feed__cards" :cols="cols" :gutter="gutter" :key="gutter" v-else>
      <template v-if="showAd">
        <da-card-placeholder v-if="!ads.length"/>
        <da-card-ad v-for="(item, index) in ads" :key="index" :ad="item" ref="posts"
                    @click="onAdClick" @impression="onAdImpression"/>
      </template>
      <da-card-post v-for="item in posts" ref="posts" :key="item.id" :post="item"
                    @bookmark="onBookmark" @publication="onPublication" @menu="onPostMenu"
                    @click="onPostClick" :show-menu="isLoggedIn" :hover="focusedItemId === item.id"
                    :menu-opened="selectedPostId === item.id" />
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
import { contentService } from '../common/services';

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
  props: {
    enableSearch: Function,
    showSearch: false,
  },
  data() {
    return {
      selectedPostId: null,
      focusedAtIndex: null
    };
  },
  computed: {
    ...mapState('ui', ['insaneMode', 'spaciness']),
    ...mapState('feed', ['ads']),
    ...mapGetters({
      posts: 'feed/feed',
      showAd: 'feed/showAd',
      isLoggedIn: 'user/isLoggedIn',
    }),
    focusedItemId() {
      const item = this.focusedItem;
      return item && item.post && item.post.id;
    },
    focusedItem() {
      if (!this.focusedAtIndex) return null;
      return this.$refs.posts[this.focusedAtIndex];
    },
    gutter() {
      if (this.spaciness === 'roomy') {
        return 48;
      }
      if (this.spaciness === 'cozy') {
        return 56;
      }
      return 32;
    },
    cols() {
      if (this.spaciness === 'cozy') {
        return {
          default: 5,
          2221: 4,
          1919: 3,
          1617: 3,
          1315: 2,
          1061: 2,
        };
      }
      if (this.spaciness === 'roomy') {
        return {
          default: 6,
          2221: 5,
          1919: 4,
          1617: 3,
          1315: 3,
          1061: 2,
        };
      }
      return {
        default: 7,
        2221: 6,
        1919: 5,
        1617: 4,
        1315: 3,
        1061: 2,
      };
    },
  },
  methods: {
    onAdClick(ad) {
      ga('send', 'event', 'Ad', 'Click', ad.source);
      this.fetchAds();
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
      // eslint-disable-next-line no-param-reassign
      post.read = true;
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

    ...mapActions({
      setFilter: 'feed/setFilter',
      fetchAds: 'feed/fetchAds',
    }),

    ...mapMutations({
      removePost: 'feed/removePost',
      toggleBookmarks: 'feed/toggleBookmarks',
    }),
  },

  mounted() {
    if (!this.ads.length) {
      this.fetchAds();
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
  --cards-margin: 32px;
  margin: calc(var(--cards-margin) * -1) 0;

  & .card, & .card-ph {
    margin: var(--cards-margin) 0;
  }

  .roomy & {
    --cards-margin: 48px;
  }

  .cozy & {
    --cards-margin: 56px;
  }
}
</style>
