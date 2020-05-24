<template>
  <div class="home page" :class="clsObj">
    <da-banner :theme="banner.theme" :title="banner.title"
               :subtitle="banner.subtitle" :cta="banner.cta"
               :url="banner.url" v-if="showBanner" @close="closeBanner"/>
    <da-header @go="onGoClicked" @login="onLogin('Header')"
               @profile="onProfile" @menu="onDndMenu"></da-header>
    <da-dnd-message v-if="dndMode" @dndOff="onDisableDndMode"/>
    <da-sidebar ref="sidebar" :disabled="showBookmarks"
                @requested-source="showRequestModal = true"
                @login="onLogin('Sidebar')"></da-sidebar>
    <div class="line-numbers" @mouseenter="$refs.sidebar.open()">
      <svgicon name="hamburger" class="line-numbers_icon"/>
      <div class="line-numbers__lines" ref="lineNumbers">
        <pre v-for="n in lineNumbers" class="micro2" :key="n">{{ n }}</pre>
      </div>
      <svg class="line-numbers__collapse" width="10" height="12" viewBox="0 0 10 12"
           xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
          <g>
            <path class="fill" d="M0 0h10v7.826L5 12 0 7.826z"></path>
            <path class="stroke" d="M.5.5v7.092L5 11.35 9.5 7.59V.5h-9z"></path>
          </g>
          <path d="M3 5h4" class="stroke" stroke-linecap="square"></path>
        </g>
      </svg>
    </div>
    <da-settings v-if="showSettings"/>
    <main class="content">
      <div class="content__header">
        <template v-if="showFilterHeader">
          <img :src="filter.info.image" :alt="filter.info.name"
               v-if="filter.type === 'publication'" class="content__header__pub-image"/>
          <h4>// {{ filter.info.name }}</h4>
          <transition name="fade">
            <button class="btn btn-water content__header__add-filter" v-if="!hasFilter"
                    @click="onAddFilter">
              <svgicon name="plus"/>
              <span>Add To Feed</span>
            </button>
          </transition>
        </template>
        <template v-else>
          <transition name="search-bar">
            <da-search v-if="showSearch" label="Search" :autofocus="true" ref="search"
                       :suggestions="searchSuggestions"
                       @submit="onSearchSubmit" @input="fetchSearchSuggestions"
                       @blur="onSearchBlur">
              <a href="https://www.algolia.com/" target="_blank" class="search__algolia-credit"
                 slot="autocomplete" @click="onAlgoliaClick" @mousedown.prevent="">
                <img src="/graphics/algolia.svg"/>
              </a>
            </da-search>
            <div v-else class="content__header__wrapper">
              <h4 v-if="!emptyFeed && showBookmarks" class="uppercase">/* {{ title }} */</h4>
              <template v-if="showMainFeed || showSearchFeed">
                <button class="btn-icon search-btn" @click="enableSearch"
                        v-tooltip="'Search posts'">
                  <svgicon name="magnifying"/>
                </button>
                <template v-if="showMainFeed">
                  <button class="btn btn-menu sort-by"
                          :class="{'not-selected': sortBy !== 'popularity'}"
                          @click="setSortBy('popularity')">Popular
                  </button>
                  <button class="btn btn-menu sort-by"
                          :class="{'not-selected': sortBy !== 'creation'}"
                          @click="setSortBy('creation')">Recent
                  </button>
                </template>
              </template>
              <a class="header__cta shadow1 " :href="cta.link" target="_blank"
                 @mouseup="ctaClick" :style="cta.style">
                <span class="header__cta__text">// {{cta.text}}</span>
                <img class="header__cta__image" :src="`/logos/${cta.logo}.svg`" v-if="cta.logo"/>
                <svgicon class="header__cta__image" :icon="cta.icon" v-else/>
              </a>
            </div>
          </transition>
        </template>
      </div>
      <template v-if="emptyFeed && showFeed">
        <div class="content__empty" v-if="showBookmarks">
          <da-svg :src="`/graphics/bookmark${theme === 'bright' ? '_bright' : ''}.svg`"
                  class="bookmarks-placeholder"/>
          <h1 class="content__empty__title">Nothing here, yet</h1>
          <p class="content__empty__text">
            Bookmark articles on the main feed and it will be shown here.
          </p>
        </div>
        <div class="content__empty" v-else-if="showSearchFeed">
          <da-svg :src="`/graphics/hello_world${theme === 'bright' ? '_bright' : ''}.svg`"
                  class="hello-world-placeholder"/>
          <h1 class="content__empty__title">No results found</h1>
          <p class="content__empty__text">
            Please try again with a new search query.
          </p>
        </div>
      </template>
      <da-feed v-else-if="showFeed" ref='feed'/>
      <DaSpinner v-if="this.$store.state.feed.loading" class="feed-spinner"/>
    </main>
    <div id="anchor" ref="anchor"></div>
    <da-go v-if="showGoModal" @close="showGoModal = false"/>
    <da-congrats v-if="showCongratsModal" @close="confirmNewUser"/>
    <da-request v-if="showRequestModal" @close="showRequestModal = false"/>
    <da-welcome v-if="showReadyModal" @close="nextInstruction"/>
    <da-login v-if="showLoginModal" @close="showLoginModal = false"/>
    <da-profile v-if="showProfileModal" @close="showProfileModal = false"/>
    <da-confirm-account v-if="showConfirmAccountModal"/>
    <da-merge v-if="hasConflicts" @confirm="mergeBookmarksConflicts"
              @cancel="clearBookmarksConflicts"/>
    <da-consent v-if="showNewTerms" @confirm="agreeToTerms"/>
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
    <da-context ref="dndContext" class="dnd-context" @open="onDndMenuOpened"
                @close="setShowDndMenu(false)">
      <template v-if="!dndMode">
        <button class="btn btn-menu"
                @click="enableDndMode('hour')">For 1 hour
        </button>
        <button class="btn btn-menu"
                @click="enableDndMode('tomorrow')">Until tomorrow
        </button>
        <button class="btn btn-menu"
                @click="enableDndMode('forever')">Forever
        </button>
      </template>
      <button v-else class="btn btn-menu" @click="onDisableDndMode">Turn Off</button>
    </da-context>
    <div class="instructions sidebar-instructions invert" v-if="sidebarInstructions">
      <div class="instructions__desc">
        Hover on the sidebar to filter your feed based on tags and sources.
      </div>
      <button class="btn btn-invert" @click="nextInstruction">
        Got it
      </button>
    </div>
  </div>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import gql from 'graphql-tag';
import DaSpinner from '@daily/components/src/components/DaSpinner.vue';
import DaHeader from '../components/DaHeader.vue';
import DaSidebar from '../components/DaSidebar.vue';
import DaDndMessage from '../components/DaDndMessage.vue';
import DaSvg from '../components/DaSvg.vue';
import DaFeed from '../components/DaFeed.vue';
import ctas from '../ctas';
import { trackPageView } from '../common/analytics';
import { contentService } from '../common/services';
import { TERMS_CONSENT_KEY, getCache, setCache } from '../common/cache';
import { enableKeyBindings, disableKeyBindings } from '../common/keyNavigationService';

export default {
  name: 'Home',

  apollo: {
    banner: {
      query: gql`query Banner($lastSeen: DateTime) {
banner(lastSeen: $lastSeen) {
  timestamp, cta, subtitle, theme, title, url
}
}`,
      fetchPolicy: 'cache-only',
      variables() {
        return { lastSeen: this.lastBannerSeen };
      },
      skip() {
        return !this.lastBannerSeen.toISOString;
      },
    },
  },

  components: {
    DaSpinner,
    DaSidebar,
    DaDndMessage,
    DaHeader,
    DaSvg,
    DaFeed,
    DaTerminal: () => import('@daily/components/src/components/DaTerminal.vue'),
    DaContext: () => import('@daily/components/src/components/DaContext.vue'),
    DaSearch: () => import('@daily/components/src/components/DaSearch.vue'),
    DaLogin: () => import('../components/DaLogin.vue'),
    DaProfile: () => import('../components/DaProfile.vue'),
    DaGo: () => import('../components/DaGo.vue'),
    DaWelcome: () => import('../components/DaWelcome.vue'),
    DaCongrats: () => import('../components/DaCongrats.vue'),
    DaRequest: () => import('../components/DaRequest.vue'),
    DaSettings: () => import('../components/DaSettings.vue'),
    DaMerge: () => import('../components/DaMerge.vue'),
    DaConsent: () => import('../components/DaConsent'),
    DaBanner: () => import('../components/DaBanner'),
    DaConfirmAccount: () => import('../components/DaConfirmAccount'),
  },

  data() {
    return {
      cta: ctas[Math.floor(Math.random() * ctas.length)],
      showGoModal: false,
      showRequestModal: false,
      showLoginModal: false,
      showProfileModal: false,
      showNewTerms: false,
      lineNumbers: 1,
      showSearch: false,
      searchSuggestions: [],
      lastPriorityData: false,
      banner: null,
    };
  },

  methods: {
    ctaClick() {
      ga('send', 'event', this.cta.name, 'Click');
    },

    updateLines() {
      this.$nextTick(() => {
        setTimeout(() => {
          const pres = this.$refs.lineNumbers.querySelectorAll('pre');
          const lines = Math.ceil(this.$refs.lineNumbers.clientHeight / pres[0].clientHeight);
          if (lines > this.lineNumbers) {
            this.lineNumbers = lines;
          }
        });
      });
    },

    onDndMenu(event) {
      ga('send', 'event', 'Dnd', 'Menu');
      if (!this.showDndMenu) {
        this.$refs.dndContext.open(event);
      } else {
        this.$refs.dndContext.close();
      }
    },

    onDndMenuOpened(event) {
      this.setShowDndMenu(true);
      const rect = event.target.getBoundingClientRect();
      this.$refs.dndContext.positionMenu({ top: rect.bottom + 8, right: rect.right });
    },

    onDisableDndMode() {
      this.$refs.dndContext.close();
      this.disableDndMode();
    },

    enableDndMode(type = 'hour') {
      let dndDate = new Date();
      if (type === 'hour') {
        dndDate.setHours(dndDate.getHours() + 1);
      } else if (type === 'tomorrow') {
        dndDate = new Date(dndDate.getFullYear(), dndDate.getMonth(), dndDate.getDate() + 1);
      } else if (type === 'forever') {
        dndDate = new Date(dndDate.getFullYear() + 100, dndDate.getMonth(), dndDate.getDate());
      }

      this.$refs.dndContext.close();
      this.setDndModeTime(dndDate.getTime());
      ga('send', 'event', 'Dnd', type);
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

    onAddFilter() {
      ga('send', 'event', 'Feed', 'Add Filter');
      this.addFilterToFeed();
    },

    setSortBy(value) {
      ga('send', 'event', 'Feed', 'Sort By', value);
      this.$store.dispatch('feed/setSortBy', value);
    },

    async onSearchSubmit(query) {
      ga('send', 'event', 'Feed', 'Search', query);
      if (this.suggestionTimeout) {
        clearTimeout(this.suggestionTimeout);
        this.suggestionTimeout = null;
      }
      this.searchSuggestions = [];
      await this.search(query);
      this.trackPageView();
    },

    clearSearch() {
      this.showSearch = false;
      if (this.$refs.search) {
        this.$refs.search.clearInput();
      }
    },

    async initHome() {
      this.generateChallenge();

      getCache(TERMS_CONSENT_KEY)
        .then((consent) => {
          this.showNewTerms = !consent;
        });

      Promise.all([
        this.fetchPublications(),
        this.fetchTags(),
      ]).then(() => this.fetchNextFeedPage())
        .then(() => this.contentObserver.observe(this.$refs.anchor))
        // TODO: handle error
        // eslint-disable-next-line no-console
        .catch(console.error);

      this.lastPriorityData = true;
      this.fetchNotifications()
        // TODO: handle error
        // eslint-disable-next-line no-console
        .catch(console.error);
    },

    trackPageView() {
      const { showBookmarks, filter, showSearchFeed } = this;

      if (showBookmarks) {
        trackPageView('/bookmarks');
      } else if (filter) {
        trackPageView(`/${filter.type}/${filter.info.id || filter.info.name}`);
      } else if (showSearchFeed) {
        trackPageView('/search');
      } else {
        trackPageView('');
      }
    },

    enableSearch() {
      disableKeyBindings();
      this.showSearch = true;
      setTimeout(() => this.$refs.search && this.$refs.search.focus(), 100);
    },

    fetchSearchSuggestions(query) {
      if (this.suggestionTimeout) {
        clearTimeout(this.suggestionTimeout);
      }
      this.suggestionTimeout = setTimeout(async () => {
        if (query.length) {
          const res = await contentService.searchSuggestion(query);
          if (res.query === this.$refs.search.query()
            && res.query !== this.$store.state.feed.search) {
            this.searchSuggestions = res.hits;
          }
        } else {
          this.searchSuggestions = [];
        }
      }, 200);
    },

    onSearchBlur() {
      if (!this.$refs.search.query().length) {
        enableKeyBindings();
        this.showSearch = false;
      }
    },

    onAlgoliaClick() {
      ga('send', 'event', 'Search', 'Algolia');
    },

    async agreeToTerms() {
      await setCache(TERMS_CONSENT_KEY, true);
      this.showNewTerms = false;
    },

    closeBanner() {
      this.$apollo.queries.banner.skip = true;
      this.setLastBannerSeen(new Date(this.banner.timestamp));
      this.banner = undefined;
    },

    ...mapActions({
      fetchNextFeedPage: 'feed/fetchNextFeedPage',
      fetchTags: 'feed/fetchTags',
      fetchPublications: 'feed/fetchPublications',
      addFilterToFeed: 'feed/addFilterToFeed',
      search: 'feed/search',
      mergeBookmarksConflicts: 'feed/mergeBookmarksConflicts',
      fetchNotifications: 'ui/fetchNotifications',
      generateChallenge: 'user/generateChallenge',
      validateAuth: 'user/validateAuth',
    }),

    ...mapMutations({
      setDaFeedReference: 'feed/setDaFeedReference',
      clearBookmarksConflicts: 'feed/clearBookmarksConflicts',
      setDndModeTime: 'ui/setDndModeTime',
      disableDndMode: 'ui/disableDndMode',
      hideNotifications: 'ui/hideNotifications',
      nextInstruction: 'ui/nextInstruction',
      setShowDndMenu: 'ui/setShowDndMenu',
      setLastBannerSeen: 'ui/setLastBannerSeen',
      confirmNewUser: 'user/confirmNewUser',
    }),
  },

  computed: {
    ...mapState('ui', ['notifications', 'showNotifications', 'showSettings', 'theme', 'showDndMenu', 'lastBannerSeen']),
    ...mapGetters('ui', ['sidebarInstructions', 'showReadyModal', 'dndMode']),
    ...mapState('feed', ['showBookmarks', 'filter', 'sortBy', 'showFeed', 'loading']),
    ...mapGetters('feed', ['emptyFeed', 'hasFilter', 'hasConflicts']),
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState({
      title(state) {
        let res = '';
        if (state.feed.showBookmarks) {
          res += 'your personal bookmarks';
        } else {
          res += 'news for you';
        }

        if (state.ui.insaneMode) {
          res += ' - insane mode';
        }

        return res;
      },

      clsObj(state) {
        return {
          'animate-cards': state.ui.enableCardAnimations,
          [state.ui.spaciness]: true,
          [state.ui.insaneMode ? 'insane-mode' : 'card-mode']: true,
          'show-banner': this.showBanner,
        };
      },

      showConfirmAccountModal(state) {
        if (this.isLoggedIn) {
          return !state.user.profile.infoConfirmed;
        }

        return false;
      },

      showCongratsModal(state) {
        if (this.isLoggedIn) {
          return state.user.profile.newUser && state.user.profile.infoConfirmed;
        }

        return false;
      },

      showSearchFeed(state) {
        return state.feed.search && state.feed.search.length;
      },
    }),
    showFilterHeader() {
      return this.filter && !this.showBookmarks;
    },
    showMainFeed() {
      return !this.showBookmarks && !this.filter && !this.showSearchFeed;
    },
    showBanner() {
      return this.banner && this.banner.title;
    },
  },

  watch: {
    lastPriorityData(val) {
      if (val) {
        this.$apollo.queries.banner.setOptions({ fetchPolicy: 'cache-and-network' });
      }
    },
    posts() {
      this.updateLines();
    },
    showBookmarks() {
      this.trackPageView();
      this.clearSearch();
    },
    filter() {
      this.trackPageView();
      this.clearSearch();
    },
    showSearchFeed(val) {
      if (!val) {
        this.trackPageView();
        this.clearSearch();
      }
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
    }, { root: null, rootMargin: '5px', threshold: 1 });
  },

  async mounted() {
    import('@daily/components/icons/arrow');
    import('@daily/components/icons/plus');
    import('@daily/components/icons/hamburger');
    import('@daily/components/icons/magnifying');

    if (this.cta.icon) {
      import(`@daily/components/icons/${this.cta.icon}`);
    }

    this.updateLines();

    requestIdleCallback(async () => {
      await this.initHome();
      await this.validateAuth();
    });

    this.setDaFeedReference(this.$refs.feed);

    this.$nextTick(() => {
      enableKeyBindings();
    });
  },

  beforeDestroy() {
    disableKeyBindings();
  },
};
</script>
<style>
.home.page {
  padding-top: 48px;
  padding-left: 36px;

  --banner-height: 40px;
  --cards-margin: 32px;
  --num-cards: 2;
  --content-margin: 40px;
  --feed-max-width: calc(var(--cards-margin) * (var(--num-cards) - 1) + 340px * var(--num-cards));

  &.roomy {
    --cards-margin: 48px;
    --content-margin: 48px;
  }

  &.cozy {
    --cards-margin: 56px;
    --content-margin: 56px;
  }

  @media (min-width: 1062px) {
    --num-cards: 3;

    &.cozy {
      --num-cards: 2;
    }
  }

  @media (min-width: 1316px) {
    --num-cards: 4;

    &.roomy {
      --num-cards: 3;
    }

    &.cozy {
      --num-cards: 3;
    }
  }

  @media (min-width: 1618px) {
    --num-cards: 5;

    &.roomy {
      --num-cards: 4;
    }
  }

  @media (min-width: 1920px) {
    --num-cards: 6;

    &.roomy {
      --num-cards: 5;
    }

    &.cozy {
      --num-cards: 4;
    }
  }

  @media (min-width: 2222px) {
    --num-cards: 7;

    &.roomy {
      --num-cards: 6;
    }

    &.cozy {
      --num-cards: 5;
    }
  }

  &.show-banner {
    margin-top: var(--banner-height);

    & .sidebar {
      padding-top: var(--banner-height);
    }
  }

  & .banner {
    position: fixed;
    left: 0;
    top: 0;
    height: var(--banner-height);
  }
}

.content {
  display: flex;
  width: 100%;
  align-self: center;
  flex-direction: column;
  padding: 0 var(--content-margin) 78px;
  max-width: calc(var(--feed-max-width) + var(--content-margin) * 2);
}

.content__header {
  position: relative;
  display: flex;
  height: 44px;
  flex-direction: row;
  align-items: center;
  margin: 32px 0;

  .roomy & {
    margin-top: 40px;
    margin-bottom: 40px;
  }

  .cozy & {
    margin-top: 48px;
    margin-bottom: 48px;
  }

  & h4 {
    color: var(--theme-secondary);

    &.uppercase {
      text-transform: uppercase;
    }
  }

  & > .btn .svg-icon {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }

  & .content__header__pub-image {
    width: 24px;
    height: 24px;
    margin: 0 8px 0 0;
    border-radius: 4px;
  }

  & .content__header__add-filter {
    margin-left: auto;
  }

  & .search {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;

    &.search-bar-enter-active, &.search-bar-leave-active {
      transition: 0.1s ease width;
    }

    &.search-bar-enter-active {
      transition-delay: 0.1s;
    }

    &.search-bar-enter, &.search-bar-leave-to {
      width: 44px;
    }
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

.content__empty {
  display: flex;
  margin-top: 120px;
  flex-direction: column;
  align-items: center;

  & img {
    height: 185px;
  }
}

.content__empty__title {
  margin: 32px 0 8px;
  color: var(--theme-primary);
  text-transform: uppercase;
}

.content__empty__text {
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
    justify-content: center;
  }
}

.v-context.context {
  &:focus {
    outline: none;
  }
}

.bookmarks-placeholder {
  height: 185px;
}

.hello-world-placeholder {
  height: 134px;
  transform: translateX(68px);
}

.line-numbers {
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  width: 36px;
  height: 100%;
  flex-direction: column;
  padding: 68px 0 0 0;
  background: var(--theme-background-highlight);
  border-right: 1px solid var(--theme-separator);

  & > * {
    margin: 8px 0;
  }
}

.line-numbers_icon {
  align-self: center;
}

.line-numbers__lines {
  flex: 1;
  overflow: hidden;
  margin-right: 8px;

  & pre {
    color: var(--theme-disabled);
    text-align: right;
    margin: 0;
  }
}

.line-numbers__collapse {
  position: absolute;
  width: 10px;
  height: 12px;
  right: -5px;
  top: 118px;
  margin: 0;

  & .fill {
    fill: var(--theme-background-primary);
  }

  & .stroke {
    stroke: var(--theme-separator);
  }
}

.btn.sort-by {
  pointer-events: none;

  &.not-selected {
    pointer-events: all;
    --button-color: var(--theme-secondary);
    @mixin lil1;
  }
}

.search-btn {
  margin-left: 8px;
}

.content__header__wrapper {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;

  &.search-bar-enter-active, &.search-bar-leave-active {
    transition: 0.1s ease opacity;
    will-change: opacity;
  }

  &.search-bar-enter-active {
    transition-delay: 0.1s;
  }

  &.search-bar-enter, &.search-bar-leave-to {
    opacity: 0;
  }
}

.search__algolia-credit {
  display: inline-block;
  height: 16px;
  padding: 0 12px;
  align-self: flex-end;

  & img {
    height: 100%;
  }
}

.feed-spinner {
  margin: 16px auto auto;
}
</style>
