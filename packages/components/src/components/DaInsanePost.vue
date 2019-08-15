<template>
  <div class="insane__wrapper">
    <div class="insane insane--post" :class="cls">
      <a :href="post.url" target="_blank" class="insane__link" @click="$emit('click', post)">
        <h5 class="insane__title">
          <da-line-clamp :text="post.title" :lines="3"/>
        </h5>
        <div class="insane__tags micro1" :title="tags">
          <da-line-clamp :text="tags" :lines="1" :truncate="truncateTags"/>
        </div>
      </a>
      <span class="insane__views micro2 reveal"
            v-if="post.readTime">// {{post.readTime}} min read</span>
      <img class="insane__icon lazyload reveal"
           :data-src="post.publication.image"
           :alt="post.publication.name" :title="post.publication.name"
           :key="post.publication.name"/>
      <div class="insane__reveal reveal">
        <button class="btn-icon insane__reveal__bookmark"
                :title="post.bookmarked ? 'Remove bookmark' : 'Bookmark'"
                @click="$emit('bookmark', { post, bookmarked: !post.bookmarked })">
          <svgicon icon="bookmark"/>
        </button>
        <button class="btn-icon insane__reveal__menu" title="Menu"
                @click="$emit('menu', { post, event: $event })" v-if="showMenu">
          <svgicon icon="menu"/>
        </button>
      </div>
      <transition name="insane-notification">
        <div class="insane__notification nuggets" v-if="notifying">
          {{ notification }}
        </div>
      </transition>
    </div>
    <svgicon icon="menu" class="insane__reveal__menu--duplicate" slot="other" v-if="menuOpened"/>
  </div>
</template>

<script>
import 'lazysizes';
import { truncateTags } from '../truncate';
import DaLineClamp from './DaLineClamp.vue';

export default {
  name: 'DaInsanePost',

  components: {
    DaLineClamp,
  },

  props: {
    post: {
      type: Object,
      required: true,
    },
    menuOpened: {
      type: Boolean,
      default: false,
    },
    showMenu: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      notifying: false,
      notification: '',
    };
  },

  computed: {
    tags() {
      return (this.post.tags || []).map(t => `#${t}`).join(',');
    },

    cls() {
      return {
        bookmarked: this.post.bookmarked,
        'menu-opened': this.menuOpened,
        'hide-menu': !this.showMenu,
      };
    },
  },

  mounted() {
        import('../../icons/bookmark');
        import('../../icons/menu');
  },

  methods: {
    notify(notification) {
      this.notification = notification;
      this.notifying = true;
      setTimeout(() => {
        this.notifying = false;
      }, 1500);
    },

    truncateTags(...args) {
      return truncateTags(this.post.tags, ...args);
    },
  },
};
</script>

<style>
.insane__wrapper {
  position: relative;
  width: 100%;
}

.insane--post {
  position: relative;
  transition: opacity 0.1s;

  & .reveal {
    transition: transform 0.2s ease-out;
  }

  &:hover, &.menu-opened {
    & .reveal {
      transform: translateX(-88px);
    }
  }

  &.hide-menu:hover .reveal {
    transform: translateX(-56px);
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
}

.insane__views {
  color: var(--theme-secondary);
}

.insane__icon {
  width: 20px;
  height: 20px;
  margin-left: 8px;
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
}

.insane__wrapper .insane__reveal__menu--duplicate {
  position: absolute;
  display: block;
  right: 13px;
  bottom: 25px;
  width: 24px;
  height: 24px;
  color: var(--theme-primary);
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
</style>
