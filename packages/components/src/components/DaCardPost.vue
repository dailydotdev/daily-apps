<template>
  <div class="post card post-article" :class="cls">
    <div class="card__header card__hmargin post__vmargin">
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
              :class="{ selected: selectedComment === item }" v-for="(item, index) in comments"
              :key="index"
              @click="onFeaturedCommentClick(item)">
        <img class="lazyload" :data-src="item.author.image" :alt="`${item.author.name}'s image`"
             v-tooltip="`See ${item.author.name.split(' ')[0]}'s comment`"/>
      </button>
      <button class="btn-icon post__bookmark post__show-on-hover post__align-right"
              :class="{ hover: bookmarksMenuOpened }" @click="onBookmarkClick"
              v-tooltip="bookmarkTooltip" v-show="!showComment">
        <svgicon name="bookmark"/>
      </button>
      <button class="btn-icon post__show-on-hover post__menu" :class="{ hover: menuOpened }"
              @click="onMenuClick"
              v-tooltip="'More'" v-if="showMenu" v-show="!showComment">
        <svgicon name="menu"/>
      </button>
    </div>
    <a class="post__link" :href="post.url" target="_blank" rel="noopener noreferrer"
       :title="post.title" @click="onLinkClick" v-show="!showComment">
      <div
        class="post__title card__hmargin post__vmargin lil1 multiline-text-overflow">
        {{post.title}}
      </div>
      <div class="post__metadata card__hmargin">
        <div>{{post.createdAt | mdyDate}}</div>
        <template v-if="post.readTime">
          <div class="post__metadata-separator"/>
          <div>{{post.readTime}}m read time</div>
        </template>
      </div>
      <div class="card__image">
        <img class="lazyload" :data-src="post.image"
             :data-lowsrc="post.placeholder" alt="Post image" :key="post.image"
             @error="useDefaultImage"/>
      </div>
    </a>
    <template v-if="showComment">
      <div class="post__comment card__hmargin">
        <div class="post__comment-name post__vmargin lil1 singleline-text-overflow">
          {{selectedComment.author.name}}
        </div>
        <div class="post__comment-content post__vmargin lil1 multiline-text-overflow">
          {{selectedComment.content}}
        </div>
      </div>
      <div class="post__buttons full-width">
        <div class="post__hseparator"></div>
        <a class="btn btn-menu"
           :href="selectedComment.permalink" target="_blank"
           rel="noopener noreferrer" @click="onCommentClick">
          <svgicon name="comment"/>
          <span>Comment</span>
        </a>
      </div>
    </template>
    <div class="post__buttons" v-show="!showComment">
      <button class="btn btn-menu" :class="{ 'post__action-completed': post.upvoted}"
              @click="onUpvoteClick">
        <svgicon name="upvote"/>
        <span>Upvote</span>
      </button>
      <template v-if="post.numComments">
        <div class="post__vseparator"></div>
        <a class="btn btn-menu" :class="{ 'post__action-completed': post.commented}"
           :href="post.commentsPermalink" target="_blank"
           rel="noopener noreferrer" @click="onCommentClick">
          <svgicon name="comment"/>
          <span>Comments</span>
        </a>
      </template>
    </div>
    <div class="post__comment-popup invert" v-if="showCommentPopup">
      <div class="micro2 card__hmargin post__vmargin">{{commentPopupTitle}}
      </div>
      <textarea ref="comment" class="post__vmargin"
                :placeholder="commentPopupPlaceholder" required
                @input="onCommentInput"></textarea>
      <div class="post__comment-popup__buttons">
        <button class="btn btn-menu" :class="{ 'post__action-completed': post.upvoted}"
                @click="onUpvoteClick">
          <svgicon name="upvote"/>
          <span>Upvote</span>
        </button>
        <button class="btn btn-invert"
                @click="onPostCommentClick" :disabled="!enablePostComment">
          <svgicon name="comment"/>
          <span>Post</span>
        </button>
      </div>
    </div>
    <div class="post__report-popup invert nuggets" v-if="notifying">
      {{notification}}
    </div>
  </div>
</template>

<script>
import 'lazysizes/plugins/blur-up/ls.blur-up';
import 'lazysizes';
import postMixin from '../common/postMixin';

export default {
  name: 'DaCardPost',
  mixins: [postMixin],

  methods: {
    useDefaultImage(e) {
      e.target.src = 'https://res.cloudinary.com/daily-now/image/upload/f_auto/v1/placeholders/1';
    },
  },
};
</script>

<style>
.card.post-article {
  padding-bottom: 0;

  & .post__metadata {
    margin-top: auto;
    margin-bottom: 12px;
  }

  & .post__hseparator {
    width: 91%;
  }

  & .post__vseparator {
    height: 20px;
  }

  & .post__buttons {
    margin-bottom: 8px;

    & .btn {
      flex: 1;
      max-width: 50%;
      margin-left: 8px;
      margin-right: 8px;
    }

    &.full-width {
      flex-direction: column;

      & .btn {
        max-width: unset;
        flex: unset;
        align-self: stretch;
      }
    }
  }

  & .post__comment {
    margin-bottom: 16px;
  }

  & .post__comment-popup__buttons {
    margin: 4px 0;
  }

  & .post__report-popup {
    left: 8px;
    right: 8px;
    bottom: 10px;
  }

  & .post__comment-popup {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 246px;

    & .card__hmargin {
      margin-left: 8px;
      margin-right: 8px;
    }

    & textarea {
      padding: 10px 12px;
    }
  }
}
</style>
