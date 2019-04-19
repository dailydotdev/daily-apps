<template>
  <div class="insane__wrapper">
    <div class="insane insane--post" :class="cls">
      <a :href="post.url" target="_blank" class="insane__link" @click="$emit('click', post)">
        <h5 class="insane__title">{{post.title | cardTitle}}</h5>
        <div class="insane__tags micro1">{{ tags }}</div>
      </a>
      <span class="insane__views micro2 reveal"
            v-if="post.readTime">// {{post.readTime}} min read</span>
      <img class="insane__icon lazyload reveal"
           :data-src="post.publication.image"
           :alt="post.publication.name" :title="post.publication.name"/>
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
    </div>
    <svgicon icon="menu" class="insane__reveal__menu--duplicate" slot="other" v-if="menuOpened"/>
  </div>
</template>

<script>
import 'lazysizes';

export default {
  name: 'DaInsanePost',
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

  computed: {
    tags() {
      return (this.post.tags || []).map(t => `#${t}`).join(', ');
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
      // TODO: implement
      console.log(notification);
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
    margin: 0 4px;
  }
}

.insane__wrapper .insane__reveal__menu--duplicate {
  position: absolute;
  display: block;
  right: 16px;
  bottom: 25px;
  width: 24px;
  height: 24px;
  color: var(--theme-primary);
}

.bookmarked .insane__reveal__bookmark .svg-icon {
  color: var(--color-burger-60);
}
</style>
