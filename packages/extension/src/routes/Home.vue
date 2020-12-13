<template>
  <div class="home page" :class="clsObj">
    <da-banner :theme="banner.theme" :title="banner.title"
               :subtitle="banner.subtitle" :cta="banner.cta"
               :url="banner.url" v-if="showBanner" @close="closeBanner"/>
    <da-header @go="onGoClicked" @login="onLogin('Header')" @menu="onDndMenu"></da-header>
    <da-dnd-message v-if="dndMode" @dndOff="onDisableDndMode"/>
    <div class="sidebar-container" :class="{opened: sidebarOpened}" v-show="!showBookmarks">
      <da-sidebar
        @loaded="fetchStage += 1"
        @login="onLogin('Sidebar')"></da-sidebar>
      <button class="sidebar-trigger"
              v-tooltip="sidebarTooltip"
              @click="toggleSidebar">
        <svgicon name="arrow"/>
      </button>
    </div>
    <button class="rank-btn" @click="openRankPopup" :class="{ signal: onboarding }">
      <div class="rank-btn__inner" v-if="onboarding">
        <da-rank :rank="1"/>
      </div>
      <da-rank-progress v-else :rank="rank" :progress="rankProgress"
        :show-rank-animation="readingRankLevelUp && neverShowRankModal"
        @rank-animation-end="confirmedRankLevelUp"/>
    </button>
    <div v-if="onboarding" class="welcome-balloon micro2">
      Welcome to your feed! Our mission is to provide you all the best programming news
      you’ll ever need. Click above to start.
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
                          :class="{'not-selected': sortBy !== 'upvotes'}"
                          @click="setSortBy('upvotes')">Most upvoted
                  </button>
                  <button class="btn btn-menu sort-by"
                          :class="{'not-selected': sortBy !== 'creation'}"
                          @click="setSortBy('creation')">Recent
                  </button>
                </template>
              </template>
              <div class="top-sites">
                <template v-if="showTopSites">
                  <a v-for="(item, index) in topSites" :key="index" class="top-site"
                     :href="item.url" v-tooltip.bottom="item.title">
                    <img :src="getIconUrl(item.url)" class="top-site__image"/>
                  </a>
                </template>
                <template v-else-if="!minimalUi">
                  <label for="top-sites-btn">
                    Show most visited sites
                  </label>
                  <button class="btn btn-hollow" id="top-sites-btn" @click="enableTopSites">
                    <svgicon name="plus"/>
                  </button>
                </template>
              </div>
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
               :fetch-stage="fetchStage" @login="onLogin('Feed')"/>
      <DaSpinner v-if="loading" class="feed-spinner"/>
    </main>
    <div id="anchor" ref="anchor"></div>
    <da-go v-if="showGoModal" @close="showGoModal = false"/>
    <da-congrats v-if="showCongratsModal" @close="confirmNewUser"/>
    <da-request v-if="showRequestModal" @close="showRequestModal = false"/>
    <da-login v-if="showLoginModal" @close="showLoginModal = false"/>
    <da-merge v-if="hasConflicts" @confirm="mergeBookmarksConflicts"
              @cancel="clearBookmarksConflicts"/>
    <da-premium v-if="showPremium" @close="setShowPremium(false)" @login="onLogin('Premium')"/>
    <da-new-source v-if="showNewSource" @close="setShowNewSource(false)"
                   @requested-source="showRequestModal = true"/>
    <da-integrations v-if="showIntegrations" @close="showIntegrations = false"/>
    <da-top-sites-modal v-if="showTopSitesModal" @close="setShowTopSitesModal(false)"/>
    <da-referral v-if="showReferral" @close="setShowReferral(false)"/>
    <da-rank-popup v-if="showRankPopup" @close="closeRankPopup"/>
    <da-unlock-ui-modal v-if="showUnlockUi" @close="unlockFullUi"/>
    <da-new-rank-modal v-if="readingRankLevelUp && !neverShowRankModal"
                       @close="closeNewRankModal"/>
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
  </div>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import { NetworkStatus } from 'apollo-client';
import DaSpinner from '@daily/components/src/components/DaSpinner.vue';
import DaRank from '@daily/components/src/components/DaRank.vue';
import DaRankProgress from '@daily/components/src/components/DaRankProgress.vue';
import { STEPS_PER_RANK } from '@daily/components/src/common/rank';
import { BANNER_QUERY } from '../graphql/home';
import { BOOKMARK_LISTS_QUERY } from '../graphql/bookmarkList';
import DaHeader from '../components/DaHeader.vue';
import DaSvg from '../components/DaSvg.vue';
import DaFeed from '../components/DaFeed.vue';
import { trackPageView } from '../common/analytics';
import { navigateDaily, validKeys, validKeysValues } from '../common/keyNavigationService';
import { CRITICAL_FETCH_STAGE, OPERATIONAL_FETCH_STAGE, ENGAGEMENT_FETCH_STAGE } from '../common/consts';

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
    DaRank,
    DaRankProgress,
    DaSidebar: () => import('../components/DaSidebar.vue'),
    DaDndMessage: () => import('../components/DaDndMessage.vue'),
    DaContext: () => import('@daily/components/src/components/DaContext.vue'),
    DaSearch: () => import('@daily/components/src/components/DaSearch.vue'),
    DaLogin: () => import('../components/DaLogin.vue'),
    DaGo: () => import('../components/DaGo.vue'),
    DaCongrats: () => import('../components/DaCongrats.vue'),
    DaRequest: () => import('../components/DaRequest.vue'),
    DaSettings: () => import('../components/DaSettings.vue'),
    DaMerge: () => import('../components/DaMerge.vue'),
    DaBanner: () => import('../components/DaBanner.vue'),
    DaBookmarkList: () => import('../components/DaBookmarkList.vue'),
    DaPremium: () => import('../components/DaPremium.vue'),
    DaNewSource: () => import('../components/DaNewSource.vue'),
    DaIntegrations: () => import('../components/DaIntegrations.vue'),
    DaReferral: () => import('../components/DaReferral.vue'),
    DaTopSitesModal: () => import('../components/DaTopSitesModal.vue'),
    DaRankPopup: () => import('../components/DaRankPopup.vue'),
    DaUnlockUiModal: () => import('../components/DaUnlockUiModal.vue'),
    DaNewRankModal: () => import('../components/DaNewRankModal.vue'),
  },

  data() {
    return {
      showGoModal: false,
      showRequestModal: false,
      showLoginModal: false,
      showIntegrations: false,
      showSearch: false,
      showRankPopup: false,
      searchSuggestions: [],
      fetchStage: null,
      banner: null,
      topSites: [],
      sidebarOpened: false,
      sidebarTooltip: 'Open sidebar',
    };
  },

  methods: {
    toggleSidebar() {
      if (this.sidebarOpened) {
        ga('send', 'event', 'Sidebar', 'Toggle', 'Close');
        this.sidebarOpened = false;
      } else {
        ga('send', 'event', 'Sidebar', 'Toggle', 'Open');
        this.sidebarOpened = true;
      }
    },
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
      }
      if (!this.isLoggedIn) {
        this.updateShownProgress();
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

    enableTopSites() {
      this.$store.commit('ui/setShowTopSitesModal', true);
    },

    async getTopSites() {
      try {
        if ('topSites' in browser) {
          this.topSites = (await browser.topSites.get()).slice(0, 8);
          return;
        }
        this.topSites = [];
      } catch {
        this.topSites = [];
      }
    },

    getIconUrl(url) {
      return `https://api.daily.dev/icon?url=${encodeURIComponent(url)}&size=20`;
    },

    openRankPopup() {
      ga('send', 'event', 'Rank', 'Click');
      this.showRankPopup = true;
    },

    closeRankPopup() {
      this.showRankPopup = false;
      this.doneOnboarding();
    },

    closeNewRankModal(neverShow) {
      this.confirmedRankLevelUp();
      if (neverShow) {
        this.setNeverShowRankModal(true);
      }
    },

    ...mapActions({
      backToMainFeed: 'feed/backToMainFeed',
      fetchNextFeedPage: 'feed/fetchNextFeedPage',
      addFilterToFeed: 'feed/addFilterToFeed',
      search: 'feed/search',
      mergeBookmarksConflicts: 'feed/mergeBookmarksConflicts',
      validateAuth: 'user/validateAuth',
      checkVisitWin: 'ui/checkVisitWin',
      trackEngagementWin: 'ui/trackEngagementWin',
      updateShownProgress: 'user/updateShownProgress',
      checkWeeklyReadingRankReset: 'user/checkWeeklyReadingRankReset',
    }),

    ...mapMutations({
      setHoveredPostAndIndex: 'feed/setHoveredPostAndIndex',
      clearBookmarksConflicts: 'feed/clearBookmarksConflicts',
      setDndModeTime: 'ui/setDndModeTime',
      disableDndMode: 'ui/disableDndMode',
      setShowDndMenu: 'ui/setShowDndMenu',
      setLastBannerSeen: 'ui/setLastBannerSeen',
      setShowPremium: 'ui/setShowPremium',
      setShowNewSource: 'ui/setShowNewSource',
      setShowReferral: 'ui/setShowReferral',
      setShowTopSitesModal: 'ui/setShowTopSitesModal',
      confirmNewUser: 'user/confirmNewUser',
      doneOnboarding: 'ui/doneOnboarding',
      unlockFullUi: 'ui/unlockFullUi',
      confirmedRankLevelUp: 'user/confirmedRankLevelUp',
      setNeverShowRankModal: 'ui/setNeverShowRankModal',
    }),
  },

  computed: {
    ...mapState('ui', ['showSettings', 'theme', 'showDndMenu', 'lastBannerSeen', 'showPremium', 'showNewSource', 'showReferral', 'insaneMode', 'showTopSites', 'showTopSitesModal', 'minimalUi', 'onboarding', 'showUnlockUi', 'neverShowRankModal']),
    ...mapGetters('ui', ['showReadyModal', 'dndMode']),
    ...mapState('feed', ['showBookmarks', 'filter', 'sortBy', 'showFeed', 'loading', 'bookmarkList', 'hoveredPostAndIndex']),
    ...mapGetters('feed', ['emptyFeed', 'hasFilter', 'hasConflicts']),
    ...mapState('user', ['readingRank', 'readingRankLevelUp']),
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
          onboarding: this.onboarding,
        };
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

      rank(state) {
        if (this.readingRankLevelUp && this.neverShowRankModal) {
          return state.user.readingRank.nextRank;
        }
        return state.user.readingRank && state.user.readingRank.rank;
      },

      rankProgress(state) {
        if (this.readingRankLevelUp && this.neverShowRankModal) {
          return STEPS_PER_RANK[this.rank - 1];
        }
        return state.user.readingRank && state.user.readingRank.shownProgress;
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
    sidebarOpened() {
      setTimeout(() => {
        this.sidebarTooltip = this.sidebarOpened ? 'Close sidebar' : 'Open sidebar';
      }, 100);
    },
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
    async showTopSites(val) {
      if (val) {
        await this.getTopSites();
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
    import('@daily/components/icons/gift');

    this.$nextTick(() => {
      window.addEventListener('keydown', this.onKeyDown);
      this.fetchStage = CRITICAL_FETCH_STAGE;
      this.checkVisitWin();
      this.checkWeeklyReadingRankReset();
      if (!this.isPremium) {
        ga('send', 'event', 'CTA', 'Impression', 'T-Shirt', { nonInteraction: true });
      }
    });

    if (this.showTopSites) {
      await this.getTopSites();
    }
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
  padding-top: 56px;

  --banner-height: 40px;
  --cards-margin: 32px;
  --num-cards: 2;
  --content-margin: 80px;
  --feed-max-width: calc(var(--cards-margin) * (var(--num-cards) - 1) + 340px * var(--num-cards));

  &.roomy {
    --cards-margin: 48px;
    --content-margin: 88px;
  }

  &.cozy {
    --cards-margin: 56px;
    --content-margin: 96px;
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
  margin: 36px 0;

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

.top-sites {
  display: flex;
  align-items: center;
  margin-left: auto;

  & label {
    margin-right: 8px;
    color: var(--theme-secondary);
    cursor: pointer;
    @mixin nuggets;
  }

  & .btn.btn-hollow {
    width: 28px;
    height: 28px;
    padding: 0;
    justify-content: center;
    --button-color: var(--theme-secondary);
    --button-border: 1px solid var(--button-color);
    --button-border-radius: 8px;

    & .svg-icon {
      width: 20px;
      height: 20px;
    }
  }

  & .top-site {
    width: 28px;
    height: 28px;
    padding: 2px;
    margin: 0 4px;
    border-radius: 8px;
    overflow: hidden;
    display: block;
    background: var(--color-salt-10);

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  & .top-site__image {
    width: 100%;
    display: block;
    border-radius: 8px;
    overflow: hidden;
  }
}

.sidebar-container {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  width: 264px;
  height: 100%;
  transform: translateX(-100%);
  transition: transform 0.2s linear;
  will-change: transform;
  z-index: 30;

  &.opened {
    transform: none;
  }
}

.sidebar-trigger {
  position: absolute;
  display: flex;
  top: 82px;
  left: 100%;
  width: 48px;
  height: 64px;
  align-items: center;
  justify-content: center;
  margin-left: -1px;
  background: var(--theme-background-primary);
  border: 1px solid var(--theme-separator);
  border-radius: 0 16px 16px 0;
  cursor: pointer;
  z-index: 0;

  & .svg-icon {
    transform: rotate(90deg);
  }

  &:hover .svg-icon {
    color: var(--theme-primary);
  }

  .sidebar-container.opened & {
    background: var(--theme-background-highlight);
    box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.24);

    & .svg-icon {
      transform: rotate(270deg);
    }

    .bright & {
      box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.08);
    }
  }
}

@keyframes rank-attention {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.rank-btn {
  position: absolute;
  display: flex;
  left: 0;
  right: 0;
  top: 16px;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background: var(--theme-background-primary);
  border: none;
  border-radius: 100%;
  cursor: pointer;
  z-index: 31;

  &.signal {
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: var(--theme-hover);
      border-radius: 100%;
      z-index: -1;
      transition: background 0.1s linear;
      animation: rank-attention 2s infinite ease-in-out;
    }

    &:hover {
      &:before {
        background: var(--theme-active);
      }
    }
  }
}

.rank-btn__inner {
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  background: var(--theme-primary);
  border-radius: 100%;
  box-shadow: 0 8px 16px 2px var(--theme-active);

  --stop-color1: var(--theme-background-primary);
  --stop-color2: var(--theme-background-primary);
}

.welcome-balloon {
  max-width: 420px;
  margin-top: 56px;
  padding: 16px 24px;
  color: var(--theme-secondary);
  border: 1px solid var(--theme-active);
  border-radius: 16px;
  text-align: center;
  align-self: center;
}
</style>
