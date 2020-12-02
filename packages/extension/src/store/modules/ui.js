import { applyTheme } from '@daily/services';
import { FIRST_INSTALL_KEY, getCache } from '../../common/cache';

const initialState = () => ({
  theme: null,
  insaneMode: false,
  spaciness: 'roomy',
  dndModeTime: null,
  showDndMenu: false,
  showTopSites: false,
  showSettings: false,
  showOnlyNotReadPosts: false,
  openNewTab: true,
  lastBannerSeen: new Date(),
  showPremium: false,
  showNewSource: false,
  showReferral: false,
  ctaClicked: false,
  // Win moments tracking
  triggeredReferral: false,
  postClicks: 0,
  bookmarks: 0,
  scrolls: 0,
  showTopSitesModal: false,
  // Onboarding
  onboarding: true,
  minimalUi: true,
  showUnlockUi: false,
});

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setTheme(state, theme) {
      state.theme = theme;
    },

    setInsaneMode(state, value) {
      state.insaneMode = value;
    },

    setShowTopSites(state, value) {
      state.showTopSites = value && 'topSites' in browser;
    },

    setShowOnlyNotReadPosts(state, value) {
      state.showOnlyNotReadPosts = value;
    },

    setOpenNewTab(state, value) {
      state.openNewTab = value;
    },

    setSpaciness(state, value) {
      state.spaciness = value;
    },

    setShowSettings(state, value) {
      state.showSettings = value;
    },

    setShowDndMenu(state, value) {
      state.showDndMenu = value;
    },

    setDndModeTime(state, value) {
      state.dndModeTime = value;
    },

    disableDndMode(state) {
      state.dndModeTime = null;
    },

    resetSettings(state) {
      const def = initialState();
      state.insaneMode = def.insaneMode;
      state.showTopSites = def.showTopSites;
      state.showOnlyNotReadPosts = def.showOnlyNotReadPosts;
      state.openNewTab = def.openNewTab;
      state.spaciness = def.spaciness;
    },

    doneOnboarding(state) {
      state.onboarding = false;
    },

    setLastBannerSeen(state, value) {
      state.lastBannerSeen = value;
    },

    setShowPremium(state, value) {
      state.showPremium = value;
    },

    setShowNewSource(state, value) {
      state.showNewSource = value;
    },

    setShowReferral(state, value) {
      state.showReferral = value;
    },

    setTriggeredReferral(state, value) {
      state.triggeredReferral = value;
      if (value) {
        state.showReferral = true;
      }
    },

    setCtaClicked(state, value) {
      state.ctaClicked = value;
    },

    setShowTopSitesModal(state, value) {
      state.showTopSitesModal = value;
    },

    checkFullUi(state) {
      if (state.minimalUi) {
        state.showUnlockUi = true;
      }
    },

    unlockFullUi(state) {
      state.showUnlockUi = false;
      state.minimalUi = false;
    },
  },
  getters: {
    dndMode(state) {
      return state.dndModeTime !== null;
    },

    dndModeTime(state) {
      return state.dndModeTime;
    },

    openNewTab(state) {
      return state.openNewTab;
    },
  },
  actions: {
    setTheme({ commit, state }, theme) {
      applyTheme(window.document, theme, state.theme);
      return commit('setTheme', theme);
    },

    reset({ commit, dispatch }) {
      const state = initialState();
      commit('resetSettings');
      return dispatch('setTheme', state.theme);
    },

    async setShowTopSites({ commit }, value) {
      if (value) {
        const granted = await browser.permissions.request({ permissions: ['topSites'] });
        if (!granted) {
          return;
        }
      }

      commit('setShowTopSites', value);
      commit('setShowTopSitesModal', false);
    },

    async checkVisitWin({ commit, state }) {
      if (!state.triggeredReferral) {
        const firstVisit = await getCache(FIRST_INSTALL_KEY, null);
        // Three weeks since first visit
        if (firstVisit) {
          const dt = ((new Date()).getTime() - (new Date(firstVisit)).getTime()) / 1000;
          if (dt >= 1814400) {
            ga('send', 'event', 'Trigger', 'Activate', '3 Weeks');
            commit('setTriggeredReferral', true);
          }
        }
      }
    },

    trackEngagementWin({ commit, state }, { action }) {
      if (!state.triggeredReferral) {
        switch (action) {
        case 'POST_CLICK':
          state.postClicks += 1;
          if (state.postClicks >= 10) {
            ga('send', 'event', 'Trigger', 'Activate', '10 Post Clicks');
            commit('setTriggeredReferral', true);
          }
          break;
        case 'BOOKMARK':
          state.bookmarks += 1;
          if (state.bookmarks >= 3) {
            ga('send', 'event', 'Trigger', 'Activate', '3 Bookmarks');
            commit('setTriggeredReferral', true);
          }
          break;
        case 'SCROLL':
          state.scrolls += 1;
          if (state.scrolls >= 30) {
            ga('send', 'event', 'Trigger', 'Activate', '30 Scrolls');
            commit('setTriggeredReferral', true);
          }
          break;
        default:
          // Nothing here
        }
      }
    },
  },
};
