<template>
  <div class="feed" :class="spaciness">
    <div class="feed__insane" v-if="insaneMode">
      <template v-for="(item, index) in posts">
        <template v-if="item.type === 'ad'">
          <da-insane-placeholder v-if="item.loading" :key="index"/>
          <da-insane-ad v-else :key="index" :ad="item" ref="posts"
                        @click="onAdClick" @impression="onAdImpression" :show-menu="isLoggedIn"
                        :selected="focusedPost === item"/>
        </template>
        <da-insane-post v-else :key="item.id" :post="item" ref="posts"
                      @bookmark="onBookmark" @publication="onPublication" @menu="onPostMenu"
                      @click="onPostClick" :show-menu="isLoggedIn"
                      :menu-opened="selectedPostId === item.id"
                      :bookmarks-menu-opened="bookmarkPostId === item.id"
                      :selected="focusedPost === item" />
      </template>
    </div>
    <masonry class="feed__cards" :cols="cols" :gutter="gutter"
            :key="gutter.toString().concat(showBookmarks)" v-else>
      <template v-for="(item, index) in posts">
        <template v-if="item.type === 'ad'">
          <da-card-placeholder v-if="item.loading" :key="index"/>
          <da-card-ad v-else :key="index" :ad="item" ref="posts"
                      @click="onAdClick" @impression="onAdImpression"
                      :selected="focusedPost === item"/>
        </template>
        <da-card-post v-else :key="item.id" :post="item" ref="posts"
                    @bookmark="onBookmark" @publication="onPublication" @menu="onPostMenu"
                    @click="onPostClick" :show-menu="isLoggedIn"
                    :menu-opened="selectedPostId === item.id"
                    :bookmarks-menu-opened="bookmarkPostId === item.id"
                    :selected="focusedPost === item"/>
      </template>
    </masonry>
    <da-context ref="context" class="feed__context" @open="onPostMenuOpened"
                @close="selectedPostId = null">
      <button class="btn btn-menu" @click="reportPost('broken')">Broken link</button>
      <button class="btn btn-menu" @click="reportPost('nsfw')">Report NSFW</button>
      <button class="btn btn-menu" @click="hidePost">Hide post</button>
    </da-context>
    <da-context v-if="isPremium" ref="bookmarkContext" class="feed__bookmark-context scrollbar"
                @open="onBookmarkMenuOpened" @close="onBookmarkMenuClosed">
      <button class="btn btn-menu bookmark-context__new-btn"
              @click="openCreateList">
        <svgicon name="plus" />
        <span>New list</span>
      </button>
      <button class="btn btn-menu bookmark-context__list-btn" :class="{active: !listId}"
              @click="onBookmarkListClick(null)">
        <span>All articles</span>
        <svgicon name="v" />
      </button>
      <button v-for="item in bookmarkLists" :key="item.id"
              class="btn btn-menu bookmark-context__list-btn" :class="{active: listId === item.id}"
              @click="onBookmarkListClick(item)">
        <span>{{item.name}}</span>
        <svgicon name="v" />
      </button>
    </da-context>
    <da-create-list v-if="showCreateList"
                    @complete="onCreateListCompleted"
                    @close="onCreateListClosed" />
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
    DaCreateList: () => import('./DaCreateList.vue'),
  },
  props: {
    bookmarkLists: Array,
  },
  data() {
    return {
      selectedPostId: null,
      bookmarkPost: null,
      showCreateList: false,
    };
  },
  computed: {
    ...mapState('ui', ['insaneMode', 'spaciness']),
    ...mapState('feed', ['ads', 'hoveredPost', 'showBookmarks', 'lastUsedBookmarkList']),
    ...mapGetters({
      posts: 'feed/feed',
      isLoggedIn: 'user/isLoggedIn',
      isPremium: 'user/isPremium',
    }),
    bookmarkPostId() {
      return this.bookmarkPost && this.bookmarkPost.id;
    },
    listId() {
      return this.bookmarkPost && this.bookmarkPost.bookmarkList
              && this.bookmarkPost.bookmarkList.id;
    },
    focusedPost() {
      if (!this.hoveredPost) {
        return null;
      }

      const item = this.hoveredPost;
      return item.ad || item.post;
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
      const delta = this.showBookmarks ? 216 : 0;
      if (this.spaciness === 'cozy') {
        return {
          default: 5,
          [2221 + delta]: 4,
          [1919 + delta]: 3,
          [1617 + delta]: 3,
          [1315 + delta]: 2,
          [1061 + delta]: 2,
          ...(this.showBookmarks ? { [768 + delta]: 1 } : {}),
        };
      }
      if (this.spaciness === 'roomy') {
        return {
          default: 6,
          [2221 + delta]: 5,
          [1919 + delta]: 4,
          [1617 + delta]: 3,
          [1315 + delta]: 3,
          [1061 + delta]: 2,
          ...(this.showBookmarks ? { [768 + delta]: 1 } : {}),
        };
      }
      return {
        default: 7,
        [2221 + delta]: 6,
        [1919 + delta]: 5,
        [1617 + delta]: 4,
        [1315 + delta]: 3,
        [1061 + delta]: 2,
        ...(this.showBookmarks ? { [768 + delta]: 1 } : {}),
      };
    },
  },
  methods: {
    onAdClick(ad) {
      ga('send', 'event', 'Ad', 'Click', ad.source);
    },

    onAdImpression(ad) {
      ga('send', 'event', 'Ad', 'Impression', ad.source, { nonInteraction: true });
    },

    async onBookmark({ event, post, bookmarked }) {
      ga('send', 'event', 'Post', 'Bookmark', bookmarked ? 'Add' : 'Remove');
      if (this.isPremium) {
        this.$refs.bookmarkContext.open(event, post);
        if (bookmarked) {
          await this.setBookmarkList(post, this.lastUsedBookmarkList);
        }
      } else {
        await this.toggleBookmarks({ id: post.id, bookmarked });
      }
    },

    onBookmarkListClick(list) {
      ga('send', 'event', 'Post', 'Bookmark', 'List');
      const currentListId = this.bookmarkPost.bookmarkList && this.bookmarkPost.bookmarkList.id;
      const newListId = list && list.id;
      if (this.bookmarkPost.bookmarked && currentListId === newListId) {
        this.toggleBookmarks({ id: this.bookmarkPost.id, bookmarked: false });
      } else {
        this.setBookmarkList(this.bookmarkPost, list);
      }
      this.$refs.bookmarkContext.close();
    },

    async setBookmarkList(post, list) {
      const origList = post.bookmarkList;
      // eslint-disable-next-line no-param-reassign
      post.bookmarkList = list;
      if (!await this.addBookmarkToList({ post, list })) {
        // eslint-disable-next-line no-param-reassign
        post.bookmarkList = origList;
      }
    },

    onBookmarkMenuOpened(event, post) {
      const rect = event.target.getBoundingClientRect();
      this.$refs.bookmarkContext.positionMenu({ bottom: rect.top - 4, right: rect.right });
      this.bookmarkPost = post;
    },

    onBookmarkMenuClosed() {
      if (!this.showCreateList) {
        this.bookmarkPost = null;
      }
    },

    openCreateList() {
      this.showCreateList = true;
      this.$refs.bookmarkContext.close();
    },

    onCreateListCompleted(list) {
      return this.setBookmarkList(this.bookmarkPost, list);
    },

    onCreateListClosed() {
      this.showCreateList = false;
      this.bookmarkPost = null;
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
        this.$refs.posts.find(com => com.post && com.post.id === postId).notify('Thanks for reporting!');
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
      toggleBookmarks: 'feed/toggleBookmarks',
      addBookmarkToList: 'feed/addBookmarkToList',
    }),

    ...mapMutations({
      removePost: 'feed/removePost',
    }),
  },
  mounted() {
    import('@daily/components/icons/v');
    import('@daily/components/icons/plus');
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

.feed__bookmark-context.context {
  max-height: 207px;
  overflow-y: auto;

  & .btn {
    & .svg-icon {
      width: 16px;
      height: 16px;
    }
  }

  & .bookmark-context__new-btn {
    height: 32px;
    justify-content: center;

    & .svg-icon {
      margin: 0 4px 0 0;
    }
  }

  & .bookmark-context__list-btn {
    height: 44px;
    --button-color: var(--theme-secondary);
    @mixin micro1;
    text-transform: none;

    & span {
      flex: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      text-align: left;
      background: none;
    }

    & .svg-icon {
      visibility: hidden;
    }

    &.active .svg-icon {
      visibility: visible;
    }
  }
}
</style>
