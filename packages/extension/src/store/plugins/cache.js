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
  let { posts } = state.feed;
  if (posts.length) {
    if (posts[0].type === 'ad') {
      posts = [{ type: 'ad', loading: true }, ...posts.slice(1, contentService.pageSize)];
    } else {
      posts = posts.slice(0, contentService.pageSize);
    }
  }
  toCache.feed = {
    disabledPublications: state.feed.disabledPublications,
    enabledTags: state.feed.enabledTags,
    posts: posts.map(post2Cache),
    bookmarks: state.feed.bookmarks.map(post2Cache),
    latest: time2Cache(state.feed.latest),
    lastUsedBookmarkList: state.feed.lastUsedBookmarkList,
  };
  if (state.feed.conflictBookmarks) {
    toCache.feed.conflictBookmarks = state.feed.conflictBookmarks.map(post2Cache);
  }
  const ui = Object.assign({}, state.ui);
  delete ui.showNotifications;
  delete ui.showDndMenu;
  delete ui.showSettings;
  delete ui.notifications;
  delete ui.showPremium;
  delete ui.showNewSource;
  toCache.ui = {
    ...ui,
    lastNotificationTime: time2Cache(state.ui.lastNotificationTime),
    lastBannerSeen: time2Cache(state.ui.lastBannerSeen),
  };
  toCache.user = vue2Json(state.user);

  return JSON.parse(JSON.stringify(toCache));
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
