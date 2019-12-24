import { setCache, STATE_KEY } from '../../common/cache';
import { contentService } from '../../common/services';

const time2Cache = time => (time ? time.getTime() : null);

const vue2Json = x => JSON.parse(JSON.stringify(x));

const post2Cache = p => ({
  ...p,
  createdAt: time2Cache(p.createdAt),
  publishedAt: time2Cache(p.publishedAt),
});

const stateToCache = (state) => {
  // TODO: add tests
  const toCache = Object.assign({}, state);
  delete toCache.initialized;
  toCache.feed = {
    tags: state.feed.tags.filter(t => t.enabled).map(vue2Json),
    publications: state.feed.publications.map(vue2Json),
    posts: state.feed.posts.slice(0, contentService.pageSize).map(post2Cache),
    bookmarks: state.feed.bookmarks.map(post2Cache),
    latest: time2Cache(state.feed.latest),
  };
  if (state.feed.conflictBookmarks) {
    toCache.feed.conflictBookmarks = state.feed.conflictBookmarks.map(post2Cache);
  }
  const ui = Object.assign({}, state.ui);
  delete ui.showNotifications;
  delete ui.showDndMenu;
  delete ui.showSettings;
  toCache.ui = {
    ...ui,
    lastNotificationTime: time2Cache(state.ui.lastNotificationTime),
  };
  toCache.user = vue2Json(state.user);

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
