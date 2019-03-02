import { setCache, STATE_KEY } from '../../common/cache';
import { contentService } from '../../common/services';

const cacheTime = time => (time ? time.getTime() : null);

const stateToCache = (state) => {
  // TODO: add tests
  const toCache = Object.assign({}, state);
  delete toCache.initialized;
  toCache.feed = {
    tags: state.feed.tags.filter(t => t.enabled),
    posts: state.feed.posts.slice(0, contentService.pageSize),
    bookmarks: state.feed.bookmarks,
    latest: cacheTime(state.feed.latest),
  };
  toCache.ui = {
    theme: state.ui.theme,
    insaneMode: state.ui.insaneMode,
    showTopSites: state.ui.showTopSites,
    notifications: state.ui.notifications,
    lastNotificationTime: cacheTime(state.ui.lastNotificationTime),
  };

  return toCache;
};

const plugin = (store) => {
  store.subscribe((mutation, state) => {
    if (mutation.type !== 'loadFromCache' && mutation.type.indexOf('reset') < 0) {
      setCache(STATE_KEY, stateToCache(state))
      // eslint-disable-next-line no-console
        .catch(err => console.warn('failed to cache state', err));
    }
  });
};

export default plugin;
