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
                        @upvote="onUpvote" @comment="onComment"
                        @closeCommentPopup="closeCommentPopup"
                        :menu-opened="selectedPostId === item.id"
                        :bookmarks-menu-opened="bookmarkPostId === item.id"
                        :selected="focusedPost === item" :open-new-tab="openNewTab"
                        :show-comment-popup="commentPostId === item.id"
                        :sending-comment="sendingComment" :comment="lastSavedComment"/>
      </template>
    </div>
    <div class="feed__cards" v-else>
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
                      @upvote="onUpvote" @comment="onComment"
                      @closeCommentPopup="closeCommentPopup"
                      :menu-opened="selectedPostId === item.id"
                      :bookmarks-menu-opened="bookmarkPostId === item.id"
                      :selected="focusedPost === item" :open-new-tab="openNewTab"
                      :show-comment-popup="commentPostId === item.id"
                      :sending-comment="sendingComment" :comment="lastSavedComment"/>
      </template>
    </div>
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
        <svgicon name="plus"/>
        <span>New list</span>
      </button>
      <button class="btn btn-menu bookmark-context__list-btn" :class="{active: !listId}"
              @click="onBookmarkListClick(null)">
        <span>All articles</span>
        <svgicon name="v"/>
      </button>
      <button v-for="item in bookmarkLists" :key="item.id"
              class="btn btn-menu bookmark-context__list-btn" :class="{active: listId === item.id}"
              @click="onBookmarkListClick(item)">
        <span>{{item.name}}</span>
        <svgicon name="v"/>
      </button>
    </da-context>
    <da-create-list v-if="showCreateList"
                    @complete="onCreateListCompleted"
                    @close="onCreateListClosed"/>
  </div>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import { contentService } from '../common/services';
import { getCache, LAST_COMMENT_KEY, setCache } from '../common/cache';

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
      commentPostId: null,
      sendingComment: false,
      lastSavedComment: '',
    };
  },
  computed: {
    ...mapState('ui', ['insaneMode', 'spaciness', 'openNewTab']),
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
      if (bookmarked) {
        this.trackEngagementWin({ action: 'BOOKMARK' });
      }
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
      this.$refs.bookmarkContext.positionMenu({ top: rect.bottom + 4, right: rect.right });
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
      this.trackEngagementWin({ action: 'POST_CLICK' });
      ga('send', 'event', 'Post', 'Click', post.source);
      this.updateCommentPopup(post);
    },

    async onUpvote({ post, upvoted }) {
      ga('send', 'event', 'Post', 'Upvote', upvoted ? 'Add' : 'Remove');
      if (this.isLoggedIn) {
        await this.toggleUpvote({ id: post.id, upvoted });
        if (upvoted) {
          await this.updateCommentPopup(post);
        }
      } else {
        this.$emit('login');
      }
    },

    async updateCommentPopup(post) {
      this.lastSavedComment = '';
      if (post.numComments > 0) {
        this.commentPostId = null;
      } else {
        this.commentPostId = post.id;
        ga('send', 'event', 'Comment Popup', 'Impression');
        await this.saveLastComment();
      }
    },

    async onComment({ post, comment }) {
      this.lastSavedComment = comment;
      if (this.isLoggedIn) {
        this.sendingComment = true;
        ga('send', 'event', 'Comment Popup', 'Comment');
        try {
          const queries = await import(/* webpackChunkName: "queries" */ '../graphql/feed');
          const res = await this.$apollo.mutate({
            mutation: queries.COMMENT_ON_POST_MUTATION,
            variables: { postId: post.id, content: comment },
          });
          window.open(res.data.commentOnPost.permalink, '_blank');
          this.commentPostId = null;
          this.lastSavedComment = '';
          // eslint-disable-next-line no-param-reassign
          post.numComments = 1;
          // eslint-disable-next-line no-param-reassign
          post.commented = true;
          await this.saveLastComment();
        } finally {
          this.sendingComment = false;
        }
      } else {
        await this.saveLastComment();
        this.$emit('login');
      }
    },

    async saveLastComment() {
      try {
        await setCache(LAST_COMMENT_KEY, {
          postId: this.commentPostId,
          comment: this.lastSavedComment,
        });
      } catch (err) {
        // Do nothing
      }
    },

    async closeCommentPopup() {
      this.commentPostId = null;
      await this.saveLastComment();
    },

    onPostMenu({ post, event }) {
      ga('send', 'event', 'Post', 'Menu');
      this.$refs.context.open(event, post);
    },

    onPostMenuOpened(event, post) {
      const rect = event.target.getBoundingClientRect();
      this.$refs.context.positionMenu({ top: rect.bottom + 4, right: rect.right });
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
      toggleUpvote: 'feed/toggleUpvote',
      addBookmarkToList: 'feed/addBookmarkToList',
      trackEngagementWin: 'ui/trackEngagementWin',
    }),

    ...mapMutations({
      removePost: 'feed/removePost',
    }),
  },
  async mounted() {
    import('@daily/components/icons/v');
    import('@daily/components/icons/plus');

    try {
      const cachedComment = await getCache(LAST_COMMENT_KEY, null);
      if (cachedComment) {
        this.commentPostId = cachedComment.postId;
        this.lastSavedComment = cachedComment.comment;
      }
    } catch (err) {
      // Do nothing
    }
  },
};
</script>

<style>
.feed__insane {
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;

  & .insane {
    margin: 4px 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .roomy & {
    max-width: 680px;

    & .insane {
      margin: 8px 0;
    }
  }

  .cozy & {
    max-width: 640px;

    & .insane {
      margin: 12px 0;
    }
  }
}

.feed__cards {
  display: grid;
  grid-template-columns: repeat(var(--num-cards), 1fr);
  grid-gap: var(--cards-margin);
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
