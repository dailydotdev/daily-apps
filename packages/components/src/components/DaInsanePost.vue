<template>
  <div class="insane insane--post" :class="cls">
    <a :href="post.url" target="_blank" class="insane__link" @click="$emit('click')">
      <h5 class="insane__title">{{post.title | cardTitle}}</h5>
      <div class="insane__tags micro1">{{ tags }}</div>
    </a>
    <span class="insane__views micro2 reveal">// {{post.views}} Views</span>
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
              @click="$emit('menu', { post })">
        <svgicon icon="menu"/>
      </button>
    </div>
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
  },

  computed: {
    tags() {
      return (this.post.tags || []).map(t => `#${t}`).join(', ');
    },

    cls() {
      return {
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
.insane--post {
  position: relative;

  & .reveal {
    transition: transform 0.2s ease-out;
  }

  &:hover .reveal {
    transform: translateX(-88px);
  }
}

.insane__tags {
  margin-top: 4px;
  color: var(--theme-disabeld);
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

.bookmarked .insane__reveal__bookmark .svg-icon {
  color: var(--color-burger-60);
}
</style>
