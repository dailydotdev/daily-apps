<template>
  <div class="post post-article insane" :class="cls">
    <div class="post__trending" v-if="post.trending" v-tooltip="trendingTooltip">
      <div></div>
    </div>
    <div class="insane__sub">
      <button class="btn-icon post__back" @click="onBackClick" v-if="showComment"
              v-tooltip="'Back'">
        <svgicon name="arrow"/>
      </button>
      <button class="post__pub post__rounded-image" @click="onPublicationClick"
              v-show="!showComment">
        <img class="lazyload" :data-src="post.publication.image" :alt="post.publication.name"
             v-tooltip="post.publication.name"
             :key="post.publication.name"/>
      </button>
      <button class="post__rounded-image post__profile-image"
              :class="{ selected: selectedComment === item }" v-for="item in comments"
              :key="item.id"
              @click="onFeaturedCommentClick(item)">
        <img class="lazyload" :data-src="item.author.image" :alt="`${item.author.name}'s image`"
             v-tooltip="`See ${item.author.name.split(' ')[0]}'s comment`"/>
      </button>
    </div>
    <div class="post__vseparator post__vmargin"></div>
    <div class="insane__main">
      <a class="post__link" :href="post.url" target="_blank" rel="noopener noreferrer"
         :title="post.title" @click="onLinkClick" @click.middle="onLinkClick" v-show="!showComment">
        <div class="post__title lil1 multiline-text-overflow">{{post.title}}</div>
        <div class="post__metadata">
          <div>{{post.createdAt | mdyDate}}</div>
          <template v-if="post.readTime">
            <div class="post__metadata-separator"/>
            <div>{{post.readTime}}m read time</div>
          </template>
          <div class="post__author" v-if="post.author">
            <svgicon name="feather"/>
            <div class="post__author__name">{{post.author.name}}</div>
          </div>
        </div>
      </a>
      <template v-if="showComment">
        <div class="post__comment">
          <div class="post__comment-name lil1 singleline-text-overflow">
            {{selectedComment.author.name}}
          </div>
          <!-- eslint-disable-next-line max-len -->
          <div class="post__comment-content lil1 multiline-text-overflow">{{selectedComment.content}}</div>
        </div>
        <div class="post__buttons">
          <a class="btn btn-menu"
             :href="selectedComment.permalink" target="_blank"
             rel="noopener noreferrer" @click="onCommentClick">
            <svgicon name="comment"/>
            <span>View comment</span>
          </a>
        </div>
      </template>
      <div class="post__buttons" v-show="!showComment">
        <div class="post__buttons__placeholder">
          <button class="btn btn-menu" :class="{ 'post__action-completed': post.upvoted}"
                  @click="onUpvoteClick">
            <svgicon name="upvote" v-tooltip="'Upvote'"/>
            <da-counter :value="post.numUpvotes" :disable="disableCounter" />
          </button>
        </div>
        <div class="post__buttons__placeholder">
          <a class="btn btn-menu" :class="{ 'post__action-completed': post.commented}"
             :href="post.commentsPermalink" target="_blank"
             rel="noopener noreferrer" @click="onCommentClick">
            <svgicon name="comment" v-tooltip="'Comment'"/>
            <da-counter :value="post.numComments" :disable="disableCounter" />
          </a>
        </div>
        <button class="btn-icon post__bookmark post__show-on-hover post__align-right"
                :class="{ hover: bookmarksMenuOpened }" @click="onBookmarkClick"
                v-tooltip="bookmarkTooltip" v-show="!showComment">
          <svgicon name="bookmark"/>
        </button>
        <button class="btn-icon post__show-on-hover post__menu" :class="{ hover: menuOpened }"
                @click="onMenuClick"
                v-tooltip="'Report post'" v-if="showMenu" v-show="!showComment">
          <svgicon name="flag"/>
        </button>
        <div class="post__report-popup invert nuggets" v-if="notifying">
          {{notification}}
        </div>
      </div>
    </div>
    <transition name="comment-slide-down">
      <div class="post__comment-popup invert" v-if="showCommentPopup && !privateSource">
        <button class="btn-icon post__comment-close" @click="closeCommentPopup">
          <svgicon name="x"/>
        </button>
        <div class="lil1 post__comment-title post__vmargin">{{commentPopupTitle}}
        </div>
        <textarea ref="comment" class="post__vmargin"
                  :placeholder="commentPopupPlaceholder" required
                  @input="onCommentInput"
                  @keydown="onCommentKeydown"></textarea>
        <div class="post__comment-popup__buttons">
          <button class="btn btn-menu" :class="{ 'post__action-completed': post.upvoted}"
                  @click="onUpvoteClick">
            <svgicon name="upvote"/>
            <span>Upvote</span>
          </button>
          <button class="btn btn-invert"
                  @click="onPostCommentClick" :disabled="!enablePostComment">
            <svgicon name="comment" v-show="!sendingComment"/>
            <span v-show="!sendingComment">Post</span>
            <da-spinner v-if="sendingComment"/>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import 'lazysizes';
import postMixin from '../common/postMixin';
import DaSpinner from './DaSpinner.vue';
import DaCounter from './DaCounter.vue';

export default {
  name: 'DaInsanePost',
  components: { DaSpinner, DaCounter },
  mixins: [postMixin],
};
</script>

<style>
.insane.post-article {
  & .insane__sub {
    & > * {
      margin: 3px;

      &:first-child {
        margin-top: 12px;
      }

      &:last-child {
        margin-bottom: 12px;
      }
    }
  }

  &.show-comment-popup {
    min-height: 174px;
  }

  & .post__comment-popup {
    left: 56px;
    right: 0;
    top: 0;
    height: 100%;

    & textarea {
      padding: 6px 12px;
    }

    & .post__comment-title {
      margin-top: 10px;
      margin-left: 0;
      margin-right: 24px;
    }
  }

  &.disabled {
    & .insane__sub, & .insane__main {
      pointer-events: none;
    }
  }

  & .post__buttons {
    position: relative;
    margin-left: -4px;
    margin-bottom: 4px;
  }

  & .post__report-popup {
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto 0;
    padding: 0 16px;
  }

  & .post__author {
    margin-left: 12px;

    & .post__author__name {
      margin-left: 4px;
      color: var(--theme-cheese);
    }
  }

  & .post__trending {
    width: 36px;
    height: 24px;
    right: 100%;
    top: 16px;
    margin-right: 1px;

    & div {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      transform: translateX(32px);
    }
  }
}
</style>
