import { applyTheme } from '@daily/services';
import createDOMPurify from 'dompurify';
import { profileService } from '../../common/services';

const initialState = () => ({
  theme: null,
  insaneMode: false,
  spaciness: 'eco',
  dndModeTime: null,
  showDndMenu: false,
  showTopSites: false,
  notifications: [],
  showNotificationBadge: false,
  lastNotificationTime: null,
  showNotifications: false,
  showSettings: false,
  enableCardAnimations: true,
  onboarding: false,
  instructionsStep: 0,
  showOnlyNotReadPosts: false,
  lastBannerSeen: new Date(0),
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
      state.showTopSites = value;
    },

    setEnableCardAnimations(state, value) {
      state.enableCardAnimations = value;
    },

    setShowOnlyNotReadPosts(state, value) {
      state.showOnlyNotReadPosts = value;
    },

    setSpaciness(state, value) {
      state.spaciness = value;
    },

    showNotifications(state) {
      state.lastNotificationTime = new Date(state.notifications[0].timestamp.getTime() + 1);
      state.showNotificationBadge = false;
      state.showNotifications = true;
    },

    hideNotifications(state) {
      state.showNotifications = false;
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

    setNotifications(state, { notifications, since }) {
      const DOMPurify = createDOMPurify(window);
      state.notifications = notifications
        .map(n => Object.assign({}, n, { html: DOMPurify.sanitize(n.html) }));
      state.showNotificationBadge = !since || !!notifications.find(n => n.timestamp > since);
    },

    nextInstruction(state) {
      state.instructionsStep += 1;
    },

    resetSettings(state) {
      const def = initialState();
      state.insaneMode = def.insaneMode;
      state.showTopSites = def.showTopSites;
      state.enableCardAnimations = def.enableCardAnimations;
      state.showOnlyNotReadPosts = def.showOnlyNotReadPosts;
    },

    doneOnboarding(state) {
      state.onboarding = true;
    },

    setLastBannerSeen(state, value) {
      state.lastBannerSeen = value;
    },
  },
  getters: {
    topSitesInstructions(state) {
      return state.instructionsStep === 0;
    },

    sidebarInstructions(state) {
      return state.instructionsStep === 1;
    },

    showReadyModal(state) {
      return state.instructionsStep === 2;
    },

    dndMode(state) {
      return state.dndModeTime !== null;
    },

    dndModeTime(state) {
      return state.dndModeTime;
    },
  },
  actions: {
    setTheme({ commit, state }, theme) {
      applyTheme(window.document, theme, state.theme);
      return commit('setTheme', theme);
    },

    async fetchNotifications({ commit, state }) {
      const since = state.lastNotificationTime;
      const notifications = await profileService.fetchNotifications(since);
      commit('setNotifications', { notifications, since });
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
    },
  },
};
