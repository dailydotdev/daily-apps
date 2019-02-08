<template>
  <div class="app">
    <da-header></da-header>
    <da-sidebar ref="sidebar"></da-sidebar>
    <div class="content">
      <div class="content__header">
        <h4>/* {{ title }} */</h4>
        <a class="header__cta shadow " :href="cta.link" target="_blank"
           @mouseup="ctaClick" :style="cta.style">
          <span class="header__cta__text">// {{cta.text}}</span>
          <img class="header__cta__image" :src="`/logos/${cta.logo}.svg`" v-if="cta.logo"/>
          <svgicon class="header__cta__image" :icon="cta.icon" v-else/>
        </a>
      </div>
      <div class="content__insane" v-if="insaneMode">
        <template v-if="!showBookmarks">
          <DaInsaneAd v-for="(item, index) in ads" :key="index" :ad="item"/>
        </template>
        <DaInsanePost v-for="item in posts" :key="item.id" :post="item"
                      @bookmark="onBookmark"/>
      </div>
      <masonry class="content__cards" :cols="cols" :gutter="32" v-else>
        <template v-if="!showBookmarks">
          <DaCardAd v-for="(item, index) in ads" :key="index" :ad="item"/>
        </template>
        <DaCardPost v-for="item in posts" :key="item.id" :post="item"
                    @bookmark="onBookmark" @menu="onPostMenu"/>
      </masonry>
    </div>
    <div id="anchor" ref="anchor"></div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import DaCardPost from '@daily/components/src/components/DaCardPost.vue';
import DaCardAd from '@daily/components/src/components/DaCardAd.vue';
import DaInsanePost from '@daily/components/src/components/DaInsanePost.vue';
import DaInsaneAd from '@daily/components/src/components/DaInsaneAd.vue';
import DaHeader from '../components/DaHeader.vue';
import DaSidebar from '../components/DaSidebar.vue';
import ctas from './ctas';

export default {
  components: {
    DaSidebar, DaHeader, DaCardPost, DaCardAd, DaInsanePost, DaInsaneAd,
  },

  data() {
    return {
      cta: ctas[Math.floor(Math.random() * ctas.length)],
      cols: {
        default: 7,
        2050: 6,
        2030: 5,
        1710: 4,
        1390: 3,
        1070: 2,
      },
      ads: [],
    };
  },

  methods: {
    ctaClick() {
      // ga('send', 'event', this.cta.name, 'Click');
    },

    updateLines() {
      this.$nextTick(() => this.$refs.sidebar.invalidate());
    },

    onBookmark({ post, bookmarked }) {
      // TODO: analytics
      this.toggleBookmarks({ id: post.id, bookmarked });
    },

    // eslint-disable-next-line
    onPostMenu({ post }) {

    },

    ...mapActions({
      fetchNextFeedPage: 'feed/fetchNextFeedPage',
      fetchTags: 'feed/fetchTags',
    }),

    ...mapMutations({
      toggleBookmarks: 'feed/toggleBookmarks',
    }),
  },

  computed: {
    ...mapState({
      posts(state) {
        if (this.showBookmarks) {
          return state.feed.bookmarks;
        }

        return state.feed.posts;
      },
      insaneMode(state) {
        return state.ui.insaneMode;
      },
      showBookmarks(state) {
        return state.feed.showBookmarks;
      },
      title(state) {
        let res = '';
        if (state.feed.showBookmarks) {
          res += 'your personal bookmarks';
        } else {
          res += 'news for developers';
        }

        if (state.ui.insaneMode) {
          res += ' - insane mode';
        }

        return res;
      },
    }),
  },

  watch: {
    posts() {
      this.updateLines();
    },
  },

  created() {
    this.contentObserver = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        if (await this.fetchNextFeedPage() && this.page > 0) {
          // ga('send', 'event', 'Feed', 'Scroll', 'Next Page', this.page);
        }
      }
    }, { root: null, rootMargin: '0px', threshold: 1 });
  },

  async mounted() {
    // TODO: add page view analytics
    // TODO: fetch ads

    if (this.cta.icon) {
      import(`@daily/components/icons/${this.cta.icon}`);
    }

    this.updateLines();

    await this.$store.dispatch('feed/fetchPublications');
    await this.fetchNextFeedPage();
    await this.fetchTags();

    this.contentObserver.observe(this.$refs.anchor);
  },
};
</script>

<style>
@import '../../../../node_modules/@daily/components/src/styles/global.pcss';

html {
  background: var(--theme-background-primary);
}

body {
  margin: 0;
}

a {
  text-decoration: none;
}

.separator {
  display: block;
  border-left: 1px dotted var(--theme-separator);
  height: 32px;
  width: 1px;
}

.app {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  color: var(--theme-primary);
}

.content {
  display: flex;
  flex-direction: column;
  margin: 24px 42px 76px 76px;
}

.content__header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;

  & h4 {
    text-transform: uppercase;
    color: var(--theme-secondary);
  }
}

.header__cta {
  display: flex;
  height: 32px;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  border-radius: 8px;
}

.header__cta__text {
  margin: 0 8px 0 16px;

  @mixin micro2;
}

.header__cta__image {
  width: 20px;
  height: 20px;
  margin: 0 8px;
  color: var(--color-salt-10);
}

.content__cards {
  margin: -32px 0;

  & .card {
    margin: 32px 0;
  }
}

.content__insane {
  border-radius: 8px;
  overflow: hidden;
}

#anchor {
  position: absolute;
  bottom: 100vh;
  left: 0;
  height: 1px;
  width: 1px;
  opacity: 0;
}
</style>
