<template>
  <div class="card" :class="cls">
    <a :href="post.url" target="_blank" class="card__link">
      <div class="card__background">
        <img class="card__background__image lazyload"
             :data-lowsrc="post.placeholder"
             :data-src="post.image"/>
      </div>
      <div class="card__content shadow">
        <h5 class="card__title">{{post.title | cardTitle}}</h5>
        <div class="card__tags nuggets"
             :title="post.tags.map(t => `#${t}`).join(',')">{{post.tags | cardTags}}
        </div>
      </div>
    </a>
    <div class="card__footer shadow">
      <img class="card__footer__icon lazyload"
           :data-src="post.publication.image"
           :alt="post.publication.name" :title="post.publication.name"/>
      <span class="card__footer__views micro2">// {{post.views}} views</span>
      <button class="btn-icon btn-small card__footer__bookmark"
              :title="post.bookmarked ? 'Remove bookmark' : 'Bookmark'"
              @click="$emit('bookmark', { post, bookmarked: !post.bookmarked })">
        <svgicon icon="bookmark"/>
      </button>
      <button class="btn-icon btn-small card__footer__menu" title="Menu"
              @click="$emit('menu', { post })">
        <svgicon icon="menu"/>
      </button>
    </div>
  </div>
</template>

<script>
import 'lazysizes/plugins/blur-up/ls.blur-up';
import 'lazysizes';

export default {
  name: 'DaCardPost',

  props: {
    post: {
      type: Object,
      required: true,
    },
  },

  computed: {
    cls() {
      return {
        [this.post.size]: true,
        bookmarked: this.post.bookmarked,
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
.card {
  & .ls-blur-up-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  & .ls-blur-up-img {
    opacity: 1;
    transition: opacity 200ms;
  }

  & .ls-blur-up-img.ls-inview.ls-original-loaded {
    opacity: 0;
  }
}
</style>
<style scoped>
.card {
  display: flex;
  flex-direction: column;
}

.card__link {
  position: relative;
  flex: 1;

  &:before {
    content: '';
    display: block;
    padding-top: 100.71%;
  }
}

.card__background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 62%;
  border-radius: 8px;
  overflow: hidden;
}

.card__background__image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .2s linear;
  transform-origin: center;
}

.card__content {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: var(--theme-background-highlight);
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid var(--theme-background-primary);
  z-index: 1;

  &:before {
    content: '';
    display: block;
    padding-top: 44%;
  }
}

.card__title {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: 24px;
  color: var(--theme-primary);
  text-align: center;
  word-break: break-word;
}

.card__tags {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 16px 24px;
  color: var(--theme-disabeld);
  text-align: center;
}

.card__footer {
  display: flex;
  height: 48px;
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
  background: var(--theme-background-highlight);
  border-radius: 0 0 8px 8px;

  & > * {
    margin: 0 4px;
  }
}

.card__footer__icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.card__footer__views {
  color: var(--theme-secondary);
}

.card__footer__bookmark {
  margin-left: auto;
}

.small {
  & .card__link:before {
    padding-top: 89.36%;
  }

  & .card__background {
    height: 57.14%;
  }
}

.large {
  & .card__link:before {
    padding-top: 110.63%;
  }

  & .card__background {
    height: 65.38%;
  }
}

.bookmarked .card__footer__bookmark .svg-icon {
  color: var(--color-burger-60);
}

.card__content, .card__footer {
  transition: transform .2s ease-in;
  transform-origin: center;
}

.card:hover {
  & .card__background__image {
    transform: translate3d(0, 4px, 0) scale(1.05);
  }
}

.animate-cards .card:hover {
  & .card__content, & .card__footer {
    transform: translate3d(0, -16px, 0) scale(1.03);
  }
}
</style>
