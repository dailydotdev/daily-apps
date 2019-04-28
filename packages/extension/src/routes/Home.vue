<template>
  <div class="page" :class="clsObj">
    <da-header @go="onGoClicked" @login="onLogin('Header')" @profile="onProfile"></da-header>
    <da-sidebar ref="sidebar" :disabled="showBookmarks"
                @requested-source="showRequestModal = true"
                @login="onLogin('Sidebar')"></da-sidebar>
    <main class="content">
      <div class="content__header">
        <template v-if="filter && !showBookmarks">
          <button class="btn content__header__back-home" @click="onBackHome">
            <svgicon icon="arrow"/>
            <span>Back Home</span>
          </button>
          <img :src="filter.info.image" :alt="filter.info.name"
               v-if="filter.type === 'publication'" class="content__header__pub-image"/>
          <h4>// {{ filter.info.name }}</h4>
          <transition name="fade">
            <button class="btn content__header__add-filter" v-if="!hasFilter"
                    @click="onAddFilter">
              <svgicon icon="plus"/>
              <span>Add To Feed</span>
            </button>
          </transition>
        </template>
        <template v-else>
          <h4 v-if="!emptyBookmarks" class="uppercase">/* {{ title }} */</h4>
          <a class="header__cta shadow1 " :href="cta.link" target="_blank"
             @mouseup="ctaClick" :style="cta.style">
            <span class="header__cta__text">// {{cta.text}}</span>
            <img class="header__cta__image" :src="`/logos/${cta.logo}.svg`" v-if="cta.logo"/>
            <svgicon class="header__cta__image" :icon="cta.icon" v-else/>
          </a>
        </template>
      </div>
      <div class="content__empty-bookmarks" v-if="emptyBookmarks">
        <img svg-inline src="../svg/bookmark.svg" alt="No bookmarks"/>
        <h1 class="content__empty-bookmarks__title">Nothing here, yet</h1>
        <p class="content__empty-bookmarks__text">
          Bookmark articles on the main feed and it will be shown here.
        </p>
      </div>
      <div class="content__insane" v-if="insaneMode">
        <template v-if="showAd">
          <da-insane-ad v-for="(item, index) in ads" :key="index" :ad="item"
                        @click="onAdClick" @impression="onAdImpression"/>
        </template>
        <da-insane-post v-for="item in posts" ref="posts" :key="item.id" :post="item"
                        @bookmark="onBookmark" @menu="onPostMenu"
                        @click="onPostClick" :show-menu="isLoggedIn"
                        :menu-opened="selectedPostId === item.id"/>
      </div>
      <masonry class="content__cards" :cols="cols" :gutter="32" v-else>
        <template v-if="showAd">
          <da-card-ad v-for="(item, index) in ads" :key="index" :ad="item"/>
        </template>
        <da-card-post v-for="item in posts" ref="posts" :key="item.id" :post="item"
                      @bookmark="onBookmark" @menu="onPostMenu"
                      @click="onPostClick" :show-menu="isLoggedIn"
                      :menu-opened="selectedPostId === item.id"/>
      </masonry>
    </main>
    <div id="anchor" ref="anchor"></div>
    <da-go v-if="showGoModal" @close="showGoModal = false"/>
    <da-congrats v-if="showCongratsModal" @close="confirmNewUser"/>
    <da-request v-if="showRequestModal" @close="showRequestModal = false"/>
    <da-welcome v-if="showReadyModal" @close="nextInstruction"/>
    <da-login v-if="showLoginModal" @close="showLoginModal = false"/>
    <da-profile v-if="showProfileModal" @close="showProfileModal = false"/>
    <da-terminal v-if="showNotifications" class="notifications" @close="hideNotifications">
      <template slot="title">Terminal</template>
      <template slot="content">
        <div class="notifications__item" v-for="(item, index) in notifications" :key="index">
          <div class="notifications__item__time">{{ item.timestamp | terminalTime }}</div>
          <div v-html="item.html"></div>
        </div>
        <div class="notifications__empty" v-if="!notifications.length">
          From time to time the terminal will announce
          new product releases and other surprises so stay tuned
        </div>
      </template>
    </da-terminal>
    <da-context ref="context" class="post-context" @open="onPostMenuOpened"
                @close="selectedPostId = null">
      <button class="context__item" @click="reportPost('broken')">Broken link</button>
      <button class="context__item" @click="reportPost('nsfw')">Report NSFW</button>
    </da-context>
    <div class="instructions sidebar-instructions invert" v-if="sidebarInstructions">
      <div class="instructions__desc">
        Hover on the sidebar to filter your feed based on tags and sources.
      </div>
      <button class="btn" @click="nextInstruction">
        Got it
      </button>
    </div>
  </div>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import DaCardPost from '@daily/components/src/components/DaCardPost.vue';
import DaCardAd from '@daily/components/src/components/DaCardAd.vue';
import DaInsanePost from '@daily/components/src/components/DaInsanePost.vue';
import DaInsaneAd from '@daily/components/src/components/DaInsaneAd.vue';
import DaHeader from '../components/DaHeader.vue';
import DaSidebar from '../components/DaSidebar.vue';
import ctas from '../ctas';
import { monetizationService, contentService } from '../common/services';
import { trackPageView } from '../common/analytics';

export default {
  name: 'Home',

  components: {
    DaSidebar,
    DaHeader,
    DaCardPost,
    DaCardAd,
    DaInsanePost,
    DaInsaneAd,
    DaTerminal: () => import('@daily/components/src/components/DaTerminal.vue'),
    DaContext: () => import('@daily/components/src/components/DaContext.vue'),
    DaLogin: () => import('../components/DaLogin.vue'),
    DaProfile: () => import('../components/DaProfile.vue'),
    DaGo: () => import('../components/DaGo.vue'),
    DaWelcome: () => import('../components/DaWelcome.vue'),
    DaCongrats: () => import('../components/DaCongrats'),
    DaRequest: () => import('../components/DaRequest'),
  },

  data() {
    return {
      cta: ctas[Math.floor(Math.random() * ctas.length)],
      cols: {
        default: 7,
        2350: 6,
        2030: 5,
        1670: 4,
        1390: 3,
        1070: 2,
      },
      ads: [],
      showGoModal: false,
      showRequestModal: false,
      showLoginModal: false,
      showProfileModal: false,
      selectedPostId: null,
    };
  },

  methods: {
    ctaClick() {
      ga('send', 'event', this.cta.name, 'Click');
    },

    updateLines() {
      this.$nextTick(() => {
        if (this.$refs.sidebar) {
          this.$refs.sidebar.invalidate();
        }
      });
    },

    onBookmark({ post, bookmarked }) {
      ga('send', 'event', 'Post', 'Bookmark', bookmarked ? 'Add' : 'Remove');
      this.toggleBookmarks({ id: post.id, bookmarked });
    },

    onPostClick(post) {
      ga('send', 'event', 'Post', 'Click', post.source);
    },

    onPostMenu({ post, event }) {
      ga('send', 'event', 'Post', 'Menu');
      this.$refs.context.open(event, post);
    },

    onPostMenuOpened(event, post) {
      const rect = event.target.getBoundingClientRect();
      this.$refs.context.positionMenu({ bottom: rect.top - 8, right: rect.right });
      this.selectedPostId = post.id;
    },

    async reportPost(reason) {
      ga('send', 'event', 'Post', 'Report', reason);
      const postId = this.selectedPostId;
      this.$refs.context.close();
      await contentService.reportPost(postId, reason);
      this.$nextTick(() => this.$refs.posts.find(com => com.post.id === postId).notify('Thanks for reporting!'));
    },

    onAdClick(ad) {
      ga('send', 'event', 'Ad', 'Click', ad.source);
    },

    onAdImpression(ad) {
      ga('send', 'event', 'Ad', 'Impression', ad.source);
    },

    onGoClicked() {
      ga('send', 'event', 'Header', 'Go');
      this.showGoModal = true;
    },

    onLogin(section) {
      ga('send', 'event', section, 'Login');
      this.showLoginModal = true;
    },

    onProfile() {
      ga('send', 'event', 'Header', 'Profile');
      this.showProfileModal = true;
    },

    onBackHome() {
      ga('send', 'event', 'Feed', 'Home');
      this.clearFilter();
    },

    onAddFilter() {
      ga('send', 'event', 'Feed', 'Add Filter');
      this.addFilterToFeed();
    },

    async initHome() {
      Promise.all([
        this.fetchPublications(),
        this.fetchTags(),
      ]).then(() => this.fetchNextFeedPage())
        .then(() => this.contentObserver.observe(this.$refs.anchor))
        // TODO: handle error
        // eslint-disable-next-line no-console
        .catch(console.error);

      // TODO: handle error
      monetizationService.fetchAd()
        .then((ads) => {
          this.ads = ads;
          if (!ads.length) {
            ga('send', 'event', 'Ad', 'NotAvailable');
          }
        })
        // TODO: handle error
        // eslint-disable-next-line no-console
        .catch(console.error);

      this.fetchNotifications()
      // TODO: handle error
      // eslint-disable-next-line no-console
        .catch(console.error);
    },

    trackPageView() {
      const { showBookmarks, filter } = this;

      if (showBookmarks) {
        trackPageView('/bookmarks');
      } else if (filter) {
        trackPageView(`/${filter.type}/${filter.info.id || filter.info.name}`);
      } else {
        trackPageView('');
      }
    },

    ...mapActions({
      fetchNextFeedPage: 'feed/fetchNextFeedPage',
      fetchTags: 'feed/fetchTags',
      fetchPublications: 'feed/fetchPublications',
      clearFilter: 'feed/clearFilter',
      addFilterToFeed: 'feed/addFilterToFeed',
      fetchNotifications: 'ui/fetchNotifications',
      refreshToken: 'user/refreshToken',
    }),

    ...mapMutations({
      toggleBookmarks: 'feed/toggleBookmarks',
      hideNotifications: 'ui/hideNotifications',
      nextInstruction: 'ui/nextInstruction',
      confirmNewUser: 'user/confirmNewUser',
    }),
  },

  computed: {
    ...mapState('ui', ['insaneMode', 'notifications', 'showNotifications']),
    ...mapGetters('ui', ['sidebarInstructions', 'showReadyModal']),
    ...mapState('feed', ['showBookmarks', 'filter']),
    ...mapState({
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

      clsObj(state) {
        return {
          'animate-cards': state.ui.enableCardAnimations,
        };
      },

      showCongratsModal(state) {
        if (this.isLoggedIn) {
          return state.user.profile.newUser;
        }

        return false;
      },
    }),

    ...mapGetters({
      posts: 'feed/feed',
      showAd: 'feed/showAd',
      hasFilter: 'feed/hasFilter',
      isLoggedIn: 'user/isLoggedIn',
    }),

    emptyBookmarks() {
      return !this.posts.length && this.showBookmarks;
    },
  },

  watch: {
    posts() {
      this.updateLines();
    },
    showBookmarks() {
      this.trackPageView();
    },
    filter() {
      this.trackPageView();
    },
  },

  created() {
    this.trackPageView();

    this.contentObserver = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        if (await this.fetchNextFeedPage() && this.page > 0) {
          ga('send', 'event', 'Feed', 'Scroll', 'Next Page', this.page);
        }
      }
    }, { root: null, rootMargin: '0px', threshold: 1 });
  },

  async mounted() {
    import('@daily/components/icons/arrow');
    import('@daily/components/icons/plus');

    if (this.cta.icon) {
      import(`@daily/components/icons/${this.cta.icon}`);
    }

    this.updateLines();
    await this.refreshToken();

    requestIdleCallback(async () => {
      await this.initHome();
    });
  },
};
</script>

<style>
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
    color: var(--theme-secondary);

    &.uppercase {
      text-transform: uppercase;
    }
  }

  & .btn .svg-icon {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }

  & .content__header__back-home {
    background: var(--theme-background-highlight);
    color: var(--theme-secondary);
    margin-right: 16px;

    & .svg-icon {
      color: var(--theme-secondary);
      transform: rotate(-90deg);
    }
  }

  & .content__header__pub-image {
    width: 24px;
    height: 24px;
    margin: 0 8px 0 0;
    border-radius: 4px;
  }

  & .content__header__add-filter {
    margin-left: auto;
    background: var(--color-water-50);
    color: var(--color-salt-10);
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

  & {
    @mixin micro2;
  }
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

.content__empty-bookmarks {
  display: flex;
  margin-top: 120px;
  flex-direction: column;
  align-items: center;

  & img {
    height: 185px;
  }
}

.content__empty-bookmarks__title {
  margin: 32px 0 8px;
  color: var(--theme-primary);
  text-transform: uppercase;
}

.content__empty-bookmarks__text {
  margin: 8px 0;
  color: var(--theme-secondary);

  & {
    @mixin jr;
  }
}

#anchor {
  position: absolute;
  bottom: 100vh;
  left: 0;
  height: 1px;
  width: 1px;
  opacity: 0;
}

.notifications {
  position: fixed;
  width: 300px;
  height: 234px;
  right: 35px;
  top: 44px;
  z-index: 100;

  & .notifications__item {
    margin: 16px 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

    & > * {
      margin: 4px 0;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  & .notifications__item__time {
    color: var(--theme-disabled);
  }

  & a {
    text-decoration: none;
    color: var(--theme-primary);

    &:visited, &:active {
      color: inherit;
    }
  }
}

.sidebar-instructions {
  top: 72px;
  left: 45px;
  width: 188px;

  & .btn {
    margin-top: 8px;
    align-self: stretch;
    justify-content: flex-end;
  }
}

.v-context.context.post-context {
  width: 130px;

  &:focus {
    outline: none;
  }
}
</style>
