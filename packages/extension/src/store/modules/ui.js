import { applyTheme } from '@daily/services';
import createDOMPurify from 'dompurify';
import { profileService } from '../../common/services';

const initialState = () => ({
  theme: null,
  insaneMode: false,
  showTopSites: true,
  notifications: [],
  showNotificationBadge: false,
  lastNotificationTime: null,
  showNotifications: false,
  enableCardAnimations: true,
  onboarding: false,
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

    showNotifications(state) {
      state.lastNotificationTime = new Date(state.notifications[0].timestamp.getTime() + 1);
      state.showNotificationBadge = false;
      state.showNotifications = true;
    },

    hideNotifications(state) {
      state.showNotifications = false;
    },

    setNotifications(state, { notifications, since }) {
      const DOMPurify = createDOMPurify(window);
      state.notifications = notifications
        .map(n => Object.assign({}, n, { html: DOMPurify.sanitize(n.html) }));
      state.showNotificationBadge = !since || !!notifications.find(n => n.timestamp > since);
    },

    resetSettings(state) {
      const def = initialState();
      state.insaneMode = def.insaneMode;
      state.showTopSites = def.showTopSites;
      state.enableCardAnimations = def.enableCardAnimations;
    },

    doneOnboarding(state) {
      state.onboarding = true;
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
  },
};
