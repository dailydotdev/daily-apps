<template>
  <div class="card card-post" :class="cls">
    <div class="card__header card__hmargin card__vmargin">
      <button class="btn-icon card__back" @click="onBackClick" v-if="showComment"
              v-tooltip="'Back'">
        <svgicon name="arrow"/>
      </button>
      <button class="card__pub card__rounded-image" @click="onPublicationClick"
              v-show="!showComment">
        <img class="lazyload" :data-src="post.publication.image" :alt="post.publication.name"
             v-tooltip="post.publication.name"
             :key="post.publication.name"/>
      </button>
      <button class="card__rounded-image card__profile-image"
              :class="{ selected: selectedComment === item }" v-for="item in comments"
              :key="item.user.id"
              @click="onFeaturedCommentClick(item)">
        <img class="lazyload" :data-src="item.user.image" :alt="`${item.user.name}'s image`"
             v-tooltip="`See ${item.user.name.split(' ')[0]}'s comment`"/>
      </button>
      <button class="btn-icon card__bookmark card__show-on-hover card__align-right"
              :class="{ hover: bookmarksMenuOpened }" @click="onBookmarkClick"
              v-tooltip="bookmarkTooltip" v-show="!showComment">
        <svgicon name="bookmark"/>
      </button>
      <button class="btn-icon card__show-on-hover card__menu" :class="{ hover: menuOpened }"
              @click="onMenuClick"
              v-tooltip="'More'" v-if="showMenu" v-show="!showComment">
        <svgicon name="menu"/>
      </button>
    </div>
    <a class="card__link" :href="post.url" target="_blank" rel="noopener noreferrer"
       :title="post.title" @click="onLinkClick" v-show="!showComment">
      <div
        class="card__title card__hmargin card__vmargin lil1 multiline-text-overflow">
        {{post.title}}
      </div>
      <div class="card__metadata card__hmargin">
        <div>{{post.createdAt | mdyDate}}</div>
        <template v-if="post.readTime">
          <div class="card__metadata-separator"/>
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
      <div class="card__comment card__hmargin">
        <div class="card__comment-name card__vmargin lil2 singleline-text-overflow">
          {{selectedComment.user.name}}
        </div>
        <div class="card__comment-content card__vmargin lil1 multiline-text-overflow">
          {{selectedComment.content}}
        </div>
      </div>
      <div class="card__buttons full-width">
        <div class="card__hseparator"></div>
        <a class="btn btn-menu"
           :href="selectedComment.permalink" target="_blank"
           rel="noopener noreferrer" @click="onCommentClick">
          <svgicon name="comment"/>
          <span>Join Discussion</span>
        </a>
      </div>
    </template>
    <div class="card__buttons" v-show="!showComment">
      <button class="btn btn-menu" :class="{ 'card__action-completed': post.upvoted}"
              @click="onUpvoteClick">
        <svgicon name="upvote"/>
        <span>Upvote</span>
      </button>
      <template v-if="post.hasComments">
        <div class="card__vseparator"></div>
        <a class="btn btn-menu" :class="{ 'card__action-completed': post.commented}"
           :href="post.commentsPermalink" target="_blank"
           rel="noopener noreferrer" @click="onCommentClick">
          <svgicon name="comment"/>
          <span>Join</span>
        </a>
      </template>
    </div>
    <div class="card__comment-popup invert" v-if="showCommentPopup">
      <div class="micro2 card__hmargin card__vmargin">Discussing this post with the community is
        fun!
      </div>
      <textarea ref="comment" class="card__vmargin"
                placeholder="Start a new discussion on this post" required
                @input="onCommentInput"></textarea>
      <div class="card__comment-popup__buttons">
        <button class="btn btn-menu" :class="{ 'card__action-completed': post.upvoted}"
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
    <div class="card__report-popup invert nuggets" v-if="notifying">
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
.card.card-post {
  padding-bottom: 0;

  & .card__rounded-image {
    padding: 0;
    border: none;
    overflow: hidden;
    cursor: pointer;
  }

  & .card__metadata {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: auto;
    margin-bottom: 12px;
  }

  & .svg-icon {
    width: 20px;
    height: 20px;
  }

  & .btn-icon {
    padding: 2px;
  }

  &.read {
    background: var(--theme-background-secondary);

    & .card__link {
      color: var(--theme-disabled);
    }

    & .card__image, & .card__rounded-image {
      opacity: 0.4;
    }
  }

  &.bookmarked {
    & .btn-icon.card__bookmark {
      --button-color: var(--color-burger-60);
    }
  }
}

.card__metadata-separator {
  width: 2px;
  height: 2px;
  border-radius: 100%;
  background: var(--theme-disabled);
  margin: 0 6px;
}

.card__buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;

  & .btn {
    flex: 1;
    max-width: 50%;
    height: 44px;
    justify-content: center;
    --button-color: var(--theme-secondary);

    @mixin nuggets;
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

.card__hseparator, .card__vseparator {
  background: var(--theme-hover);
}

.card__hseparator {
  width: 91%;
  height: 1px;
}

.card__vseparator {
  width: 1px;
  height: 20px;
}

.card.card-post .btn.btn-menu.card__action-completed {
  &, &:hover {
    --button-color: var(--theme-avocado);
  }
}

.card__show-on-hover {
  display: none;
}

.card__back .svg-icon {
  transform: rotate(-90deg);
}

.card__profile-image {
  opacity: 0.64;

  &.selected {
    opacity: 1;
  }
}

.card__comment {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 16px;
}

.card__comment-name {
  max-width: 100%;
  color: var(--theme-primary);
}

.card__comment-content {
  color: var(--theme-secondary);
  height: 200px;
  -webkit-line-clamp: 10;
}

.card__comment-popup, .card__report-popup {
  position: absolute;
  display: flex;
  color: var(--theme-primary);
  background: var(--theme-background-highlight);
  z-index: 2;
}

.card__report-popup {
  left: 8px;
  right: 8px;
  bottom: 10px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.card__comment-popup {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 246px;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  padding: 8px 16px;
  border-radius: 16px;

  & .card__hmargin {
    margin-left: 8px;
    margin-right: 8px;
  }

  & textarea {
    flex: 1;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid var(--theme-separator);
    color: var(--theme-primary);
    background: none;
    font-size: 10px;
    line-height: 16px;
    letter-spacing: 0.4px;
    resize: none;

    &::placeholder {
      color: var(--theme-secondary);
    }

    &:focus {
      outline: none;
      border-color: var(--theme-primary);
    }
  }
}

.card__comment-popup__buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0;

  & .btn {
    height: 32px;
    justify-content: center;

    @mixin nuggets;
  }

  & .btn.btn-menu {
    width: 102px;
    --button-color: var(--theme-secondary);
  }

  & .btn.btn-invert {
    width: 124px;
    --button-border-radius: 12px;
  }
}
</style>
