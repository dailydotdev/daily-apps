<template>
  <div class="insane__wrapper">
    <div class="insane insane--post" :class="cls">
      <a :href="post.url" class="insane__link post__link"
          @click="$emit('click', post)">
        <h5 class="insane__title">
          <da-line-clamp :text="post.title" :lines="3"/>
        </h5>
        <div class="insane__tags micro1" v-tooltip="tags">
          <span class="insane__tags__read-time"
                v-if="post.readTime">{{ post.readTime }} min read</span>
          <span v-if="post.readTime && tags.length > 0"> / </span>
          <da-line-clamp :text="tags" :lines="1" :truncate="truncateTags"/>
        </div>
      </a>
      <span class="insane__views micro2 reveal"
            v-if="post.createdAt"> {{post.createdAt | mdyDate}} </span>
      <button class="btn-icon insane__publication reveal" v-if="post.publication.name"
              @click="$emit('publication', { pub: post.publication })">
        <img class="insane__icon lazyload"
             :data-src="post.publication.image"
             :alt="post.publication.name" v-tooltip="post.publication.name"
             :key="post.publication.name"/>
      </button>
      <div class="insane__reveal reveal">
        <button class="btn-icon insane__reveal__bookmark"
                v-tooltip="post.bookmarked ? 'Remove bookmark' : 'Bookmark'"
                @click="$emit('bookmark', { event: $event, post, bookmarked: !post.bookmarked })">
          <svgicon name="bookmark"/>
        </button>
        <button class="btn-icon insane__reveal__menu" v-tooltip="'More'"
                @click="$emit('menu', { post, event: $event })" v-if="showMenu">
          <svgicon name="menu" class="menu__icon"/>
        </button>
      </div>
      <div v-if="privateSource" class="insane__private-mark"></div>
      <transition name="insane-notification">
        <div class="insane__notification nuggets" v-if="notifying">
          {{ notification }}
        </div>
      </transition>
    </div>
    <svgicon name="menu" class="insane__reveal__menu--duplicate" slot="other" v-if="menuOpened"/>
    <svgicon name="bookmark" class="insane__reveal__bookmark--duplicate" slot="other"
            v-if="bookmarksMenuOpened"/>
  </div>
</template>

<script>
import 'lazysizes';
import postMixin from '../common/postMixin';
import DaLineClamp from './DaLineClamp.vue';

export default {
  name: 'DaInsanePost',
  mixins: [postMixin],
  components: {
    DaLineClamp,
  },

  computed: {
    tags() {
      return (this.post.tags || []).map(t => `#${t}`).join(',');
    },

    cls() {
      return {
        bookmarked: this.post.bookmarked,
        read: this.post.read,
        'menu-opened': this.menuOpened || this.bookmarksMenuOpened,
        'hide-menu': !this.showMenu,
        hover: this.selected,
      };
    },
  },

  mounted() {
    import('../../icons/bookmark');
    import('../../icons/menu');
  },
};
</script>

<style>
.insane__wrapper {
  position: relative;
  width: 100%;

  & .menu__icon {
    opacity: 0;
  }
}

.insane--ad .insane__reveal {
  width: 56px;
}

.insane--ad,
.insane--post {
  position: relative;
  transition: opacity 0.1s;
  will-change: transform;

  & .insane__link {
    outline: none;
  }

  & .reveal {
    transition: transform 0.2s ease-out;
  }

  &:hover, &.menu-opened, &.hover {
    & .reveal {
      transform: translateX(-88px);
    }
  }

  &.hide-menu:hover .reveal, &.hide-menu.hover .reveal {
    transform: translateX(-56px);
  }

  &.read {
    background: var(--theme-background-secondary);

    & .insane__title {
      color: var(--theme-secondary);
    }
  }

  & .menu__icon {
    opacity: 1;
  }
}

.menu-opened.insane--post {
  opacity: 0.4;
  pointer-events: none;
}

.insane__tags {
  margin-top: 4px;
  color: var(--theme-disabled);
  max-width: 600px;

  & > * {
    word-break: break-all;
  }
}

.insane__views {
  color: var(--theme-secondary);
}

.insane__publication {
  margin-left: 8px;
}

.insane__icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.insane__reveal {
  position: absolute;
  display: flex;
  left: 100%;
  top: 0;
  height: 100%;
  padding: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: var(--theme-background-primary);

  & .btn-icon {
    margin: 0 2px;
  }
}

.insane__notification {
  position: absolute;
  display: flex;
  right: 0;
  top: 0;
  bottom: 0;
  width: 222px;
  height: 40px;
  align-items: center;
  justify-content: center;
  margin: auto 0;
  color: var(--color-salt-10);
  background: var(--color-water-60);
  border-radius: 8px 0 0 8px;
  z-index: 10;
}

.insane__wrapper .insane__reveal__menu--duplicate,
.insane__wrapper .insane__reveal__bookmark--duplicate {
  position: absolute;
  width: 24px;
  height: 24px;
}

.insane__wrapper .insane__reveal__menu--duplicate {
  right: 13px;
  bottom: 25px;
  color: var(--theme-primary);
}

.insane__wrapper .insane__reveal__bookmark--duplicate {
  right: 47px;
  bottom: 29px;
  color: var(--color-burger-60);
}

.bookmarked .insane__reveal__bookmark .svg-icon {
  color: var(--color-burger-60);
}

.insane-notification-enter-active, .insane-notification-leave-active {
  transition: transform 0.2s;
}

.insane-notification-enter, .insane-notification-leave-to {
  transform: translateX(100%);
}

.insane__private-mark {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  height: 12px;
  margin: auto 0;
  background: var(--theme-premium);
  border-radius: 2px;
}
</style>
