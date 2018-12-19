<template>
  <DaCard class="card--post" :class="cls" :title="post.title" :url="post.url" :image="post.image"
          :placeholder="post.placeholder" :size="post.size">
    <div slot="content" class="card__tags nuggets"
         :title="post.tags.map(t => `#${t}`).join(', ')">{{post.tags | cardTags}}
    </div>
    <template slot="footer">
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
    </template>
  </DaCard>
</template>

<script>
import DaCard from './DaCard.vue';

export default {
  name: 'DaCardPost',
  components: { DaCard },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },

  computed: {
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
.card--post .card__content {
  border-bottom: 1px solid var(--theme-background-primary);
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

.bookmarked .card__footer__bookmark .svg-icon {
  color: var(--color-burger-60);
}
</style>
