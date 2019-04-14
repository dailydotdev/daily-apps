<template>
  <DaCard class="card--post" :class="cls" :title="post.title" :url="post.url" :image="post.image"
          :placeholder="post.placeholder" :size="post.size" @click="$emit('click', post)">
    <div slot="content" class="card__tags nuggets"
         :title="(post.tags || []).map(t => `#${t}`).join(', ')">{{post.tags | cardTags}}
    </div>
    <template slot="footer">
      <img class="card__footer__icon lazyload"
           :data-src="post.publication.image"
           :alt="post.publication.name" :title="post.publication.name"/>
      <span class="card__footer__views micro2"
            v-if="post.readTime">// {{post.readTime}}m read</span>
      <button class="btn-icon btn-small card__footer__bookmark"
              :title="post.bookmarked ? 'Remove bookmark' : 'Bookmark'"
              @click="$emit('bookmark', { post, bookmarked: !post.bookmarked })">
        <svgicon icon="bookmark"/>
      </button>
      <button class="btn-icon btn-small card__footer__menu" title="Menu"
              @click="$emit('menu', { post, event: $event })" v-if="showMenu">
        <svgicon icon="menu"/>
      </button>
      <transition name="post-notification">
        <div class="card__footer__notification nuggets" v-if="notifying">
          {{ notification }}
        </div>
      </transition>
    </template>
    <svgicon icon="menu" class="card__menu--duplicate  card__hover" slot="other" v-if="menuOpened"/>
  </DaCard>
</template>

<script>
import 'lazysizes';
import DaCard from './DaCard.vue';

export default {
  name: 'DaCardPost',
  components: { DaCard },
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
    cls() {
      return {
        bookmarked: this.post.bookmarked,
        'menu-opened': this.menuOpened,
        hover: this.menuOpened,
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
  },
};
</script>
<style>
.card--post {
  position: relative;

  & .card__footer {
    position: relative;
    overflow: hidden;
  }
}

.card--post .card__content {
  border-bottom: 1px solid var(--theme-background-primary);

  @mixin shadow1;
}

.card--post .card__menu--duplicate {
  position: absolute;
  display: block;
  right: 16px;
  bottom: 14px;
  width: 20px;
  height: 20px;
  color: var(--theme-primary);
}

.menu-opened.card--post {
  pointer-events: none;

  & .card__link, & .card__footer {
    opacity: 0.4;
  }
}

.animate-cards .card.hover .card__menu--duplicate {
  right: 12px;
}

.card__tags {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 16px 24px;
  color: var(--theme-disabled);
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

.card__footer__notification {
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  margin: 0;
  color: var(--color-salt-10);
  background: var(--color-water-60);
}

.bookmarked .card__footer__bookmark .svg-icon {
  color: var(--color-burger-60);
}

.post-notification-enter-active, .post-notification-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.post-notification-enter, .post-notification-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
  transform: translateY(100%);
}
</style>
