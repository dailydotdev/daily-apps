import { defaultTheme, applyTheme } from '@daily/services';
import { profileService, contentService } from '../../common/services';

const isLoggedIn = state => !!state.user.profile;

const syncSettings = (state) => {
  if (isLoggedIn(state)) {
    return profileService.updateSettings({
      theme: state.ui.theme || defaultTheme,
      showTopSites: state.ui.showTopSites,
      enableCardAnimations: state.ui.enableCardAnimations,
      insaneMode: state.ui.insaneMode,
      spaciness: state.ui.spaciness,
      showOnlyNotReadPosts: state.ui.showOnlyNotReadPosts,
    });
  }

  return Promise.resolve();
};

const syncPublications = (state) => {
  if (isLoggedIn(state)) {
    const pubs = state.feed.publications
      .filter(p => !p.enabled)
      .map(p => ({ publicationId: p.id, enabled: p.enabled }));
    if (pubs.length > 0) {
      return contentService.updateFeedPublications(pubs);
    }
  }

  return Promise.resolve();
};

const syncTags = (state) => {
  if (isLoggedIn(state)) {
    const tags = state.feed.tags.filter(t => t.enabled).map(t => t.name);
    if (tags.length > 0) {
      return contentService.addUserTags(tags);
    }
  }

  return Promise.resolve();
};

const syncBookmarks = (state) => {
  if (isLoggedIn(state) && state.feed.bookmarks.length > 0) {
    return contentService.addBookmarks(state.feed.bookmarks.map(b => b.id));
  }

  return Promise.resolve();
};

const plugin = (store) => {
  let syncing = false;

  const fetchPersonalization = async () => {
    syncing = true;
    try {
      const settings = await profileService.fetchSettings();
      store.commit('ui/setInsaneMode', settings.insaneMode);
      store.commit('ui/setShowTopSites', settings.showTopSites);
      store.commit('ui/setEnableCardAnimations', settings.enableCardAnimations);
      store.commit('ui/setSpaciness', settings.spaciness);
      store.commit('ui/setShowOnlyNotReadPosts', settings.showOnlyNotReadPosts);
      const pr1 = store.dispatch('ui/setTheme', settings.theme);
      const pr2 = contentService.fetchFeedPublications()
        .then(pubs => store.commit('feed/setDisabledPublications', Object.keys(pubs)));
      const pr3 = contentService.fetchUserTags()
        .then(tags => store.commit('feed/setEnabledTags', tags));
      await Promise.all([pr1, pr2, pr3]);
    } finally {
      syncing = false;
    }
  };

  store.subscribe(async (mutation, state) => {
    if (syncing) {
      return;
    }

    switch (mutation.type) {
    case 'loadFromCache':
      if (state.ui && state.ui.theme) {
        applyTheme(window.document, state.ui.theme, null);
      }

      if (isLoggedIn(state)) {
        requestIdleCallback(async () => {
          // TODO: handle error
          await fetchPersonalization(state);
        });
      }
      break;
    case 'ui/setTheme':
    case 'ui/setInsaneMode':
    case 'ui/setShowTopSites':
    case 'ui/setEnableCardAnimations':
    case 'ui/setSpaciness':
    case 'ui/setShowOnlyNotReadPosts':
      // TODO: handle error
      await syncSettings(state);
      break;
    case 'user/setProfile':
      if (mutation.payload) {
        if (mutation.payload.newUser) {
          // TODO: handle error
          await Promise.all([
            syncSettings(state),
            syncPublications(state),
            syncBookmarks(state),
            syncTags(state),
          ]);
        } else {
          // TODO: handle error
          await fetchPersonalization(state);
        }
      }
      break;
    case 'feed/toggleBookmarks':
      if (isLoggedIn(state)) {
        const { id, bookmarked } = mutation.payload;
        if (bookmarked) {
          // TODO: handle error
          await contentService.addBookmarks([id]);
        } else {
          // TODO: handle error
          await contentService.removeBookmark(id);
        }
      }
      break;
    default:
      break;
    }
  });
};

export default plugin;
