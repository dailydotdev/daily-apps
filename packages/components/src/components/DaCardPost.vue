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
              :class="{ selected: selectedComment === item }" v-for="item in comments"
              :key="item.id"
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
    <a class="post__link" :href="post.url" :target="shouldOpenNewTab" rel="noopener noreferrer"
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
        <div class="post__author" v-if="post.author">
          <img class="lazyload" :data-src="post.author.image" alt="Author image"/>
          <div class="post__author__name">{{post.author.name}}</div>
          <svgicon name="feather"/>
        </div>
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
        <!-- eslint-disable-next-line max-len -->
        <div class="post__comment-content post__vmargin lil1 multiline-text-overflow">{{selectedComment.content}}</div>
      </div>
      <div class="post__buttons">
        <div class="post__hseparator"></div>
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
          <da-counter :value="post.numUpvotes" />
        </button>
      </div>
      <div class="post__buttons__placeholder">
        <a class="btn btn-menu" :class="{ 'post__action-completed': post.commented}"
           :href="post.commentsPermalink" target="_blank"
           rel="noopener noreferrer" @click="onCommentClick">
          <svgicon name="comment" v-tooltip="'Comment'"/>
          <da-counter :value="post.numComments" />
        </a>
      </div>
    </div>
    <transition name="comment-slide-up">
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
    <div class="post__report-popup invert nuggets" v-if="notifying">
      {{notification}}
    </div>
  </div>
</template>

<script>
import 'lazysizes/plugins/blur-up/ls.blur-up';
import 'lazysizes';
import postMixin from '../common/postMixin';
import DaSpinner from './DaSpinner.vue';
import DaCounter from './DaCounter.vue';

export default {
  name: 'DaCardPost',
  components: { DaSpinner, DaCounter },
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
    margin-left: 20px;
    margin-bottom: 8px;
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

  & .post__author__name {
    margin-left: 8px;
    color: var(--theme-secondary);
  }

  & .post__author {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 40px;
    padding: 0 12px 0 16px;
    background: var(--theme-background-primary);

    & .svg-icon {
      margin-left: auto;
    }
  }
}
</style>
