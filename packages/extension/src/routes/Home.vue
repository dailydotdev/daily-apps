<template>
  <div class="home page" :class="clsObj">
    <da-banner :theme="banner.theme" :title="banner.title"
               :subtitle="banner.subtitle" :cta="banner.cta"
               :url="banner.url" v-if="showBanner" @close="closeBanner"/>
    <da-header @go="onGoClicked" @login="onLogin('Header')"
               @profile="onProfile" @menu="onDndMenu"></da-header>
    <da-dnd-message v-if="dndMode" @dndOff="onDisableDndMode"/>
    <da-sidebar ref="sidebar" v-if="fetchStage >= 2"
                @loaded="fetchStage += 1"
                @login="onLogin('Sidebar')"></da-sidebar>
    <div class="line-numbers" @mouseenter="$refs.sidebar && $refs.sidebar.open()"
         v-show="!showBookmarks">
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
    <da-bookmark-list v-if="showBookmarks"/>
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
              <a href="https://www.algolia.com/" class="search__algolia-credit"
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
                  <button class="btn-icon integration-btn" @click="openIntegrations"
                          v-tooltip="'Integrations'">
                    <da-svg src="/graphics/glitter.svg" class="glitter-mark"/>
                    <svgicon name="integration"/>
                  </button>
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
              <button class="header__cta shadow1" @click="ctaClick" :style="cta.style"
                      v-if="!isPremium">
                <span class="header__cta__text">{{cta.text}}</span>
                <img class="header__cta__image" :src="`/logos/${cta.logo}.svg`" v-if="cta.logo"/>
                <svgicon class="header__cta__image" :icon="cta.icon" v-else/>
              </button>
            </div>
          </transition>
        </template>
      </div>
      <template v-if="emptyFeed && showFeed">
        <div class="content__empty" v-if="bookmarkList === 'unread' && !isLoggedIn">
          <h1 class="content__empty__title">Unread articles</h1>
          <p class="content__empty__text">
            Sign in to keep track of your unread bookmarks.
          </p>
          <button class="btn btn-water-cheese content__empty__button"
                  @click="onLogin('Unread')">
            Sign in now
          </button>
        </div>
        <div class="content__empty" v-else-if="bookmarkList === 'unread'">
          <h1 class="content__empty__title">No unread articles</h1>
          <p class="content__empty__text">
            Go back to the main feed and look for awesome content.
          </p>
        </div>
        <div class="content__empty" v-else-if="showBookmarks">
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
      <da-feed v-else-if="showFeed" ref='feed' :bookmark-lists="bookmarkLists"
               @login="onLogin('Feed')"/>
      <DaSpinner v-if="loading" class="feed-spinner"/>
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
    <da-premium v-if="showPremium" @close="setShowPremium(false)" @login="onLogin('Premium')"/>
    <da-new-source v-if="showNewSource" @close="setShowNewSource(false)"
                   @requested-source="showRequestModal = true"/>
    <da-integrations v-if="showIntegrations" @close="showIntegrations = false"/>
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
    <da-referral v-if="showReferral" @close="setShowReferral(false)"/>
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
import { NetworkStatus } from 'apollo-client';
import DaSpinner from '@daily/components/src/components/DaSpinner.vue';
import { BANNER_QUERY, LATEST_NOTIFICATIONS_QUERY } from '../graphql/home';
import { BOOKMARK_LISTS_QUERY } from '../graphql/bookmarkList';
import DaHeader from '../components/DaHeader.vue';
import DaSvg from '../components/DaSvg.vue';
import DaFeed from '../components/DaFeed.vue';
import ctas from '../ctas';
import { trackPageView } from '../common/analytics';
import { navigateDaily, validKeys, validKeysValues } from '../common/keyNavigationService';

const CRITICAL_FETCH_STAGE = 1;
const OPERATIONAL_FETCH_STAGE = 2;
const ENGAGEMENT_FETCH_STAGE = 4;

export default {
  name: 'Home',

  apollo: {
    banner: {
      query: BANNER_QUERY,
      fetchPolicy: 'cache-only',
      variables() {
        return { lastSeen: this.lastBannerSeen };
      },
      skip() {
        return !this.lastBannerSeen || !this.lastBannerSeen.toISOString;
      },
    },
    notifications: {
      query: LATEST_NOTIFICATIONS_QUERY,
      fetchPolicy: 'cache-only',
      manual: true,
      async result({ data, networkStatus, loading }) {
        if (networkStatus === NetworkStatus.ready && !loading && data.latestNotifications) {
          const dompurify = await import('dompurify');
          const DOMPurify = dompurify.default(window);
          this.notifications = data.latestNotifications
            .map(n => ({ timestamp: new Date(n.timestamp), html: DOMPurify.sanitize(n.html) }));
          const timestamp = this.notifications.length && this.notifications[0].timestamp;
          this.updateNotificationBadge(timestamp);
        }
      },
    },
    bookmarkLists: {
      query: BOOKMARK_LISTS_QUERY,
      fetchPolicy: 'cache-only',
      result({ networkStatus, loading }) {
        if (networkStatus === NetworkStatus.ready && !loading
          && this.fetchStage >= OPERATIONAL_FETCH_STAGE) {
          this.fetchStage += 1;
        }
      },
      skip() {
        return !this.isPremium;
      },
    },
  },

  components: {
    DaSpinner,
    DaHeader,
    DaSvg,
    DaFeed,
    DaSidebar: () => import('../components/DaSidebar.vue'),
    DaDndMessage: () => import('../components/DaDndMessage.vue'),
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
    DaBanner: () => import('../components/DaBanner'),
    DaConfirmAccount: () => import('../components/DaConfirmAccount'),
    DaBookmarkList: () => import('../components/DaBookmarkList'),
    DaPremium: () => import('../components/DaPremium'),
    DaNewSource: () => import('../components/DaNewSource'),
    DaIntegrations: () => import('../components/DaIntegrations'),
    DaReferral: () => import('../components/DaReferral'),
  },

  data() {
    return {
      cta: ctas[Math.floor(Math.random() * ctas.length)],
      showGoModal: false,
      showRequestModal: false,
      showLoginModal: false,
      showProfileModal: false,
      showIntegrations: false,
      lineNumbers: 1,
      showSearch: false,
      searchSuggestions: [],
      fetchStage: null,
      banner: null,
    };
  },

  methods: {
    onKeyDown({ keyCode, target }) {
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return null;
      }

      if (validKeysValues.indexOf(keyCode) === -1) return null;

      if (keyCode === validKeys.esc) return this.backToDailyFeed();

      if (keyCode === validKeys['/']) return this.enableSearch();

      const [hoveredPost, index] = this.hoveredPostAndIndex || [null, -1];

      if (keyCode === validKeys.b && hoveredPost && hoveredPost.post) {
        return hoveredPost.$emit('bookmark', {
          post: hoveredPost.post,
          bookmarked: !hoveredPost.post.bookmarked,
        });
      }

      const { posts } = this.$refs.feed.$refs;
      const postAndIndex = navigateDaily(keyCode, posts, [hoveredPost, index], this.insaneMode);

      return this.setHoveredPostAndIndex(postAndIndex);
    },

    backToDailyFeed() {
      if (!this.showBookmarks) return this.backToMainFeed();

      this.$store.dispatch('feed/setShowBookmarks', !this.showBookmarks);

      return ga('send', 'event', 'Header', 'Bookmarks', !this.showBookmarks);
    },

    ctaClick() {
      ga('send', 'event', 'CTA', 'Click', this.cta.text);
      this.setShowReferral(true);
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

    criticalFetch() {
      const loadFeed = this.fetchNextFeedPage()
        .then(() => requestIdleCallback(() => this.contentObserver.observe(this.$refs.anchor)));
      const loadAuth = this.validateAuth();
      return Promise.all([loadFeed, loadAuth]);
    },

    operationalFetch() {
      if (this.$apollo.queries.bookmarkLists) {
        this.$apollo.queries.bookmarkLists.setOptions({ fetchPolicy: 'cache-and-network' });
      }
      if (!this.isPremium) {
        this.fetchStage += 1;
      }
    },

    engagementFetch() {
      if (this.$apollo.queries.banner) {
        this.$apollo.queries.banner.setOptions({ fetchPolicy: 'cache-and-network' });
        this.$apollo.queries.notifications.setOptions({ fetchPolicy: 'cache-and-network' });
      }
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
      this.showSearch = true;
      setTimeout(() => this.$refs.search && this.$refs.search.focus(), 100);
    },

    fetchSearchSuggestions(query) {
      if (this.suggestionTimeout) {
        clearTimeout(this.suggestionTimeout);
      }
      this.suggestionTimeout = setTimeout(async () => {
        if (query.length) {
          const { contentService } = await import('../common/services');
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
        this.showSearch = false;
      }
    },

    onAlgoliaClick() {
      ga('send', 'event', 'Search', 'Algolia');
    },

    openIntegrations() {
      ga('send', 'event', 'Home', 'Integrations');
      this.showIntegrations = true;
    },

    closeBanner() {
      this.$apollo.queries.banner.skip = true;
      this.setLastBannerSeen(new Date(this.banner.timestamp));
      this.banner = undefined;
    },

    ...mapActions({
      backToMainFeed: 'feed/backToMainFeed',
      fetchNextFeedPage: 'feed/fetchNextFeedPage',
      addFilterToFeed: 'feed/addFilterToFeed',
      search: 'feed/search',
      mergeBookmarksConflicts: 'feed/mergeBookmarksConflicts',
      generateChallenge: 'user/generateChallenge',
      validateAuth: 'user/validateAuth',
      checkVisitWin: 'ui/checkVisitWin',
      trackEngagementWin: 'ui/trackEngagementWin',
    }),

    ...mapMutations({
      setHoveredPostAndIndex: 'feed/setHoveredPostAndIndex',
      clearBookmarksConflicts: 'feed/clearBookmarksConflicts',
      setDndModeTime: 'ui/setDndModeTime',
      disableDndMode: 'ui/disableDndMode',
      hideNotifications: 'ui/hideNotifications',
      nextInstruction: 'ui/nextInstruction',
      setShowDndMenu: 'ui/setShowDndMenu',
      setLastBannerSeen: 'ui/setLastBannerSeen',
      updateNotificationBadge: 'ui/updateNotificationBadge',
      setShowPremium: 'ui/setShowPremium',
      setShowNewSource: 'ui/setShowNewSource',
      setShowReferral: 'ui/setShowReferral',
      confirmNewUser: 'user/confirmNewUser',
    }),
  },

  computed: {
    ...mapState('ui', ['showNotifications', 'showSettings', 'theme', 'showDndMenu', 'lastBannerSeen', 'showPremium', 'showNewSource', 'showReferral', 'insaneMode']),
    ...mapGetters('ui', ['sidebarInstructions', 'showReadyModal', 'dndMode']),
    ...mapState('feed', ['showBookmarks', 'filter', 'sortBy', 'showFeed', 'loading', 'bookmarkList', 'hoveredPostAndIndex']),
    ...mapGetters('feed', ['emptyFeed', 'hasFilter', 'hasConflicts']),
    ...mapGetters('user', ['isLoggedIn', 'isPremium']),
    ...mapState({
      title(state) {
        let res = '';
        if (state.feed.showBookmarks) {
          res += 'your personal bookmarks';
        } else {
          res += 'news for you';
        }

        return res;
      },

      clsObj(state) {
        return {
          [state.ui.spaciness]: true,
          [state.ui.insaneMode ? 'insane-mode' : 'card-mode']: true,
          'show-banner': this.showBanner,
          'show-bookmarks': this.showBookmarks,
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
    async fetchStage(val) {
      if (val === CRITICAL_FETCH_STAGE) {
        await this.criticalFetch();
        await this.$nextTick();
        this.fetchStage = OPERATIONAL_FETCH_STAGE;
      } else if (val === OPERATIONAL_FETCH_STAGE) {
        this.operationalFetch();
      } else if (val === ENGAGEMENT_FETCH_STAGE) {
        this.engagementFetch();
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
        if (await this.fetchNextFeedPage()) {
          ga('send', 'event', 'Feed', 'Scroll', 'Next Page');
          this.trackEngagementWin({ action: 'SCROLL' });
        }
      }
    }, { root: null, rootMargin: '20px', threshold: 1 });
  },

  async mounted() {
    import('@daily/components/icons/arrow');
    import('@daily/components/icons/plus');
    import('@daily/components/icons/hamburger');
    import('@daily/components/icons/magnifying');
    import('@daily/components/icons/integration');

    if (this.cta.icon) {
      import(`@daily/components/icons/${this.cta.icon}`);
    }

    this.updateLines();

    requestIdleCallback(async () => {
      this.generateChallenge();
    });

    this.$nextTick(() => {
      window.addEventListener('keydown', this.onKeyDown);
      this.fetchStage = CRITICAL_FETCH_STAGE;
      this.checkVisitWin();
      if (!this.isPremium) {
        ga('send', 'event', 'CTA', 'Impression', this.cta.text, { nonInteraction: true });
      }
    });
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  },
};
</script>
<style>
@define-mixin cards-xs {
  --num-cards: 3;

  &.cozy {
    --num-cards: 2;
  }
}

@define-mixin cards-s {
  --num-cards: 4;

  &.roomy {
    --num-cards: 3;
  }

  &.cozy {
    --num-cards: 3;
  }
}

@define-mixin cards-m {
  --num-cards: 5;

  &.roomy {
    --num-cards: 4;
  }
}

@define-mixin cards-l {
  --num-cards: 6;

  &.roomy {
    --num-cards: 5;
  }

  &.cozy {
    --num-cards: 4;
  }
}

@define-mixin cards-xl {
  --num-cards: 7;

  &.roomy {
    --num-cards: 6;
  }

  &.cozy {
    --num-cards: 5;
  }
}

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
    @mixin cards-xs;
  }

  @media (min-width: 1316px) {
    @mixin cards-s;
  }

  @media (min-width: 1618px) {
    @mixin cards-m;
  }

  @media (min-width: 1920px) {
    @mixin cards-l;
  }

  @media (min-width: 2222px) {
    @mixin cards-xl;
  }

  &.show-bookmarks {
    --num-cards: 1;
    padding-left: 256px;

    @media (min-width: 984px) {
      --num-cards: 2;
    }

    @media (min-width: 1278px) {
      @mixin cards-xs;
    }

    @media (min-width: 1532px) {
      @mixin cards-s;
    }

    @media (min-width: 1834px) {
      @mixin cards-m;
    }

    @media (min-width: 2136px) {
      @mixin cards-l;
    }

    @media (min-width: 2438px) {
      @mixin cards-xl;
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
  margin: 28px 0;

  .roomy & {
    margin-top: 36px;
    margin-bottom: 36px;
  }

  .cozy & {
    margin-top: 44px;
    margin-bottom: 44px;
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
  height: 40px;
  padding: 6px 6px 6px 16px;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.header__cta__text {
  margin-right: 10px;

  & {
    @mixin lil2;
  }
}

.header__cta__image {
  width: 28px;
  height: 28px;
  color: var(--color-salt-10);
}

.content__empty {
  display: flex;
  max-width: 600px;
  margin-top: 120px;
  flex-direction: column;
  align-items: center;
  align-self: center;

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
  text-align: center;

  & {
    @mixin jr;
  }
}

.content__empty__button {
  height: 48px;
  margin-top: 16px;
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
  background: var(--theme-background-primary);
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

.search-btn, .integration-btn {
  margin-left: 8px;
}

.integration-btn .glitter-mark {
  top: 5px;
  right: 3px;
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

.bookmark-list {
  position: fixed;
  left: 0;
  top: 48px;
  bottom: 0;
  width: 256px;
}

.bookmark-modal .modal__container {
  width: 450px;
  padding: 40px 40px 32px;

  & h3 {
    text-transform: uppercase;
  }

  & p {
    max-width: 340px;
    margin: 8px 0;
    color: var(--theme-secondary);
    @mixin micro2;

    & strong {
      color: var(--theme-primary);
      font-style: normal;
    }
  }

  & .text-field {
    width: 100%;
    margin: 10px 0 32px;
  }

  & h3 + form .text-field {
    margin-top: 24px;
  }

  & form {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }
}

.modal__close-btn {
  position: absolute;
  right: 16px;
  top: 16px;
}

.bookmark-modal__confirm, .bookmark-modal__cancel {
  justify-content: center;
}

.bookmark-modal__cancel {
  width: 138px;
}

.bookmark-modal__cancel + .bookmark-modal__confirm {
  width: 216px;
}

.bookmark-modal__buttons {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.glitter-mark {
  position: absolute;
  z-index: 1;
  width: 6px;
  height: 6px;

  & svg {
    display: block;
    fill: var(--theme-premium);
  }
}

.premium-badge {
  width: 80px;
  height: 18px;
}

.premium-badge,
.premium-glitter-badge {
  & #bg {
    fill: var(--theme-premium);
  }
}

.premium-glitter-badge {
  width: 210px;
  height: 54px;

  & #text {
    fill: var(--color-salt-10);
  }
}
</style>
