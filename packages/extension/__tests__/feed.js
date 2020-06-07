import MockDate from 'mockdate';
import module from '../src/store/modules/feed';
import { testAction, runAction } from './fixtures/helpers';
import { contentService, monetizationService } from '../src/common/services';
import { apolloClient } from '../src/apollo';
import {
  FEED_QUERY,
  ANONYMOUS_FEED_QUERY,
  SOURCE_FEED_QUERY,
  TAG_FEED_QUERY,
  BOOKMARKS_FEED_QUERY,
  SEARCH_POSTS_QUERY,
} from '../src/graphql/feed';
import {
  ADD_BOOKMARKS_MUTATION,
  REMOVE_BOOKMARK_MUTATION,
  ADD_BOOKMARK_TO_LIST_MUTATION,
} from '../src/graphql/bookmarks';

jest.mock('../src/apollo');

jest.mock('../src/common/services', () => ({
  contentService: {
    fetchPublications: jest.fn(),
    fetchPopularTags: jest.fn(),
    updateFeedPublications: jest.fn(),
    addUserTags: jest.fn(),
    deleteUserTag: jest.fn(),
  },
  monetizationService: {
    fetchAd: jest.fn(),
  },
}));

const emptyFeed = { 
  data: {
    feed: {
      pageInfo: { hasNextPage: true, endCursor: 'cursor' },
      edges: [],
    },
  },  
};

const anonymousHandler = jest.fn();
const feedHandler = jest.fn();
const bookmarksHandler = jest.fn();
const sourceFeedHandler = jest.fn();
const tagFeedHandler = jest.fn();
const searchPostHandler = jest.fn();
const addBookmarksHandler = jest.fn();
const removeBookmarkHandler = jest.fn();
const addBookmarkToListHandler = jest.fn();
apolloClient.setRequestHandler(ANONYMOUS_FEED_QUERY, anonymousHandler);
apolloClient.setRequestHandler(FEED_QUERY, feedHandler);
apolloClient.setRequestHandler(BOOKMARKS_FEED_QUERY, bookmarksHandler);
apolloClient.setRequestHandler(SOURCE_FEED_QUERY, sourceFeedHandler);
apolloClient.setRequestHandler(TAG_FEED_QUERY, tagFeedHandler);
apolloClient.setRequestHandler(SEARCH_POSTS_QUERY, searchPostHandler);
apolloClient.setRequestHandler(ADD_BOOKMARKS_MUTATION, addBookmarksHandler);
apolloClient.setRequestHandler(REMOVE_BOOKMARK_MUTATION, removeBookmarkHandler);
apolloClient.setRequestHandler(ADD_BOOKMARK_TO_LIST_MUTATION, addBookmarkToListHandler);

beforeEach(() => {
  anonymousHandler.mockReset();
  feedHandler.mockReset();
  bookmarksHandler.mockReset();
  sourceFeedHandler.mockReset();
  tagFeedHandler.mockReset();
  searchPostHandler.mockReset();
  addBookmarksHandler.mockReset();
  addBookmarksHandler.mockResolvedValue({ data: { addBookmarks: { _: true }}});
  removeBookmarkHandler.mockReset();
  removeBookmarkHandler.mockResolvedValue({ data: { removeBookmark: { _: true }}});
  addBookmarkToListHandler.mockReset();
  addBookmarkToListHandler.mockResolvedValue({ data: { addBookmarkToList: { _: true }}});
});

it('should set show bookmarks in state', () => {
  const state = {};
  module.mutations.setShowBookmarks(state, true);
  expect(state.showBookmarks).toEqual(true);
  expect(state.bookmarkList).toEqual(null);
});

it('should commit set show bookmarks', async () => {
  const state = {};
  await testAction(module.actions.setShowBookmarks, true, state,
    [{ type: 'setShowBookmarks', payload: true }],
    [], { user: { profile: null } },
  );
});

it('should commit set show bookmarks and refresh feed', async () => {
  const state = {};
  await testAction(module.actions.setShowBookmarks, true, state,
    [{ type: 'setShowBookmarks', payload: true }],
    [{ type: 'refreshFeed' }],
    { user: { profile: { name: 'John' } } },
    { 'user/isLoggedIn': true },
  );
});

it('should remove publication from disabledPublications', () => {
  const state = { disabledPublications: { angular: true, vue: true } };
  module.mutations.enablePublication(state, { id: 'angular', enabled: true });
  expect(state.disabledPublications).toEqual({ vue: true });
});

it('should add publication to disabledPublications', () => {
  const state = { disabledPublications: { angular: true } };
  module.mutations.enablePublication(state, { id: 'vue', enabled: false });
  expect(state.disabledPublications).toEqual({ angular: true, vue: true });
});

it('should set enabled publication and refresh feed', async () => {
  const pubs = { id: 'vue', enabled: true };
  const state = {};
  await testAction(module.actions.setEnablePublication, pubs, state,
    [{ type: 'enablePublication', payload: pubs }],
    [{ type: 'refreshFeed' }], { }, { 'user/isLoggedIn': false });
});

it('should set enabled publication, refresh feed and update user', async () => {
  const pubs = { id: 'angular', enabled: true };
  const state = { disabledPublications: { angular: true } };
  await testAction(module.actions.setEnablePublication, pubs, state,
    [{ type: 'enablePublication', payload: pubs }],
    [{ type: 'refreshFeed' }], { }, { 'user/isLoggedIn': true });
  expect(contentService.updateFeedPublications)
    .toBeCalledWith([{ publicationId: 'angular', enabled: true }]);
});

it('should set disabled publications', () => {
  const state = {};
  module.mutations.setDisabledPublications(state, ['angular', 'vue']);
  expect(state.disabledPublications).toEqual({ angular: true, vue: true });
});

it('should set enabled tags', () => {
  const state = {};
  module.mutations.setEnabledTags(state, ['angular', 'vue']);
  expect(state.enabledTags).toEqual({ angular: true, vue: true });
});

it('should set filter in state', () => {
  const state = {};
  const filter = { type: 'publication', info: { id: 'angular', name: 'Angular' } };
  module.mutations.setFilter(state, filter);
  expect(state.filter).toEqual(filter);
});

it('should remove tag from enabled tags', () => {
  const state = { enabledTags: { angular: true, vue: true } };
  module.mutations.enableTag(state, { tag: 'angular', enabled: false });
  expect(state.enabledTags).toEqual({ vue: true });
});

it('should add tag to enabled tags', () => {
  const state = { enabledTags: { vue: true } };
  module.mutations.enableTag(state, { tag: 'angular', enabled: true });
  expect(state.enabledTags).toEqual({ angular: true, vue: true });
});

it('should set enabled tag and refresh feed', async () => {
  const tags = { tag: 'vue', enabled: true };
  const state = {};
  await testAction(module.actions.setEnableTag, tags, state,
    [{ type: 'enableTag', payload: tags }],
    [{ type: 'refreshFeed' }], { }, { 'user/isLoggedIn': false });
});

it('should set enabled tag, refresh feed and add user tag', async () => {
  const state = { enabledTags: {} };
  const tags = { tag: 'angular', enabled: true };
  await testAction(module.actions.setEnableTag, tags, state,
    [{ type: 'enableTag', payload: tags }],
    [{ type: 'refreshFeed' }], { }, { 'user/isLoggedIn': true });
  expect(contentService.addUserTags).toBeCalledWith(['angular']);
});

it('should set enabled tag, refresh feed and delete user tag', async () => {
  const state = { enabledTags: {} };
  const tags = { tag: 'angular', enabled: false };
  await testAction(module.actions.setEnableTag, tags, state,
    [{ type: 'enableTag', payload: tags }],
    [{ type: 'refreshFeed' }], { }, { 'user/isLoggedIn': true });
  expect(contentService.deleteUserTag).toBeCalledWith('angular');
});

it('should set a post as bookmarked and add it to bookmarks', () => {
  const state = {
    posts: [{
      id: '1',
    }, {
      id: '2',
    }, {
      id: '3',
    }],
    bookmarks: [],
  };
  module.mutations.toggleBookmarks(state, { id: '2', bookmarked: true });
  expect(state.posts).toEqual([{
    id: '1',
  }, {
    id: '2',
    bookmarked: true,
    bookmarkList: null,
  }, {
    id: '3',
  }]);
  expect(state.bookmarks).toEqual([{
    id: '2',
    bookmarked: true,
    bookmarkList: null,
  }]);
});

it('should set a post as not bookmarked and remove it from bookmarks', () => {
  const state = {
    posts: [{
      id: '1',
      bookmarked: true,
    }, {
      id: '2',
    }, {
      id: '3',
      bookmarked: true,
    }],
    bookmarks: [{
      id: '1',
      bookmarked: true,
    }, {
      id: '3',
      bookmarked: true,
    }],
  };
  module.mutations.toggleBookmarks(state, { id: '3', bookmarked: false });
  expect(state.posts).toEqual([{
    id: '1',
    bookmarked: true,
  }, {
    id: '2',
  }, {
    id: '3',
    bookmarked: false,
    bookmarkList: null,
  }]);
  expect(state.bookmarks).toEqual([{
    id: '1',
    bookmarked: true,
  }]);
});

it('should set a post as bookmarked and add set its list', () => {
  const state = {
    posts: [{
      id: '1',
    }, {
      id: '2',
    }, {
      id: '3',
    }],
    bookmarks: [],
  };
  module.mutations.toggleBookmarks(state, { id: '2', bookmarked: true, list: { id: 'list' } });
  expect(state.posts).toEqual([{
    id: '1',
  }, {
    id: '2',
    bookmarked: true,
    bookmarkList: { id: 'list' },
  }, {
    id: '3',
  }]);
  expect(state.bookmarks).toEqual([{
    id: '2',
    bookmarked: true,
    bookmarkList: { id: 'list' },
  }]);
});

it('should update the bookmark list', () => {
  const state = {
    posts: [{
      id: '1',
    }, {
      id: '2',
      bookmarked: true,
    }, {
      id: '3',
    }],
    bookmarks: [ { id: '2', bookmarked: true } ],
  };
  module.mutations.toggleBookmarks(state, { id: '2', bookmarked: true, list: { id: 'list' } });
  expect(state.posts).toEqual([{
    id: '1',
  }, {
    id: '2',
    bookmarked: true,
    bookmarkList: { id: 'list' },
  }, {
    id: '3',
  }]);
  expect(state.bookmarks).toEqual([{
    id: '2',
    bookmarked: true,
    bookmarkList: { id: 'list' },
  }]);
});

it('should remove from bookmarks when changing to other list', () => {
  const state = {
    posts: [{
      id: '1',
    }, {
      id: '2',
      bookmarked: true,
    }, {
      id: '3',
    }],
    bookmarks: [ { id: '2', bookmarked: true } ],
    bookmarkList: 'list',
  };
  module.mutations.toggleBookmarks(state, { id: '2', bookmarked: true, list: { id: 'list2' } });
  expect(state.posts).toEqual([{
    id: '1',
  }, {
    id: '2',
    bookmarked: true,
    bookmarkList: { id: 'list2' },
  }, {
    id: '3',
  }]);
  expect(state.bookmarks).toEqual([]);
});

it('should return hasFilter false when no filter', () => {
  const state = {
    filter: null,
  };
  const result = module.getters.hasFilter(state);
  expect(result).toEqual(false);
});

it('should return hasFilter true when publication is enabled', () => {
  const state = {
    disabledPublications: { vue: true },
    filter: {
      type: 'publication',
      info: {
        id: 'angular',
      },
    },
  };
  const result = module.getters.hasFilter(state);
  expect(result).toEqual(true);
});

it('should return hasFilter false when publication is disabled', () => {
  const state = {
    disabledPublications: { vue: true },
    filter: {
      type: 'publication',
      info: {
        id: 'vue',
      },
    },
  };
  const result = module.getters.hasFilter(state);
  expect(result).toEqual(false);
});

it('should return hasFilter true when tag is enabled', () => {
  const state = {
    enabledTags: { angular: true },
    filter: {
      type: 'tag',
      info: {
        name: 'angular',
      },
    },
  };
  const result = module.getters.hasFilter(state);
  expect(result).toEqual(true);
});

it('should return hasFilter false when tag is disabled', () => {
  const state = {
    enabledTags: { angular: true },
    filter: {
      type: 'tag',
      info: {
        name: 'vue',
      },
    },
  };
  const result = module.getters.hasFilter(state);
  expect(result).toEqual(false);
});

it('should reset feed', () => {
  const state = {
    posts: [{
      id: '1',
      bookmarked: true,
    }],
    pageInfo: {
      hasNextPage: true,
      endCursor: 'cursor',
    },
  };
  module.mutations.resetFeed(state);
  expect(state.customPosts).toEqual([]);
  expect(state.pageInfo).toEqual(null);
});

it('should enable publication from filter', async () => {
  const state = {
    disabledPublications: { vue: true },
    filter: {
      type: 'publication',
      info: {
        id: 'vue',
      },
    },
  };
  await testAction(module.actions.addFilterToFeed, undefined, state,
    [],
    [{ type: 'setEnablePublication', payload: { id: 'vue', enabled: true } }],
  );
});

it('should enable tag from filter', async () => {
  const state = {
    enabledTags: { angular: true },
    filter: {
      type: 'tag',
      info: {
        name: 'vue',
        enabled: false,
      },
    },
  };
  await testAction(module.actions.addFilterToFeed, undefined, state,
    [],
    [{ type: 'setEnableTag', payload: { tag: 'vue', enabled: true } }]);
});

it('should reset personalization', () => {
  const state = {
    filter: { type: 'tag' },
    enabledTags: { angular: true },
    disabledPublications: { vue: true },
    showBookmarks: true,
    bookmarks: [{
      id: '1',
      bookmarked: true,
    }, {
      id: '3',
      bookmarked: true,
    }],
  };
  module.mutations.resetPersonalization(state);
  expect(state.filter).toEqual(null);
  expect(state.enabledTags).toEqual({});
  expect(state.disabledPublications).toEqual({});
  expect(state.showBookmarks).toEqual(false);
  expect(state.bookmarks).toEqual([]);
  expect(state.bookmarkList).toEqual(null);
});

it('should reset everything', async () => {
  const state = {};
  await testAction(
    module.actions.reset,
    undefined,
    state,
    [{ type: 'resetPersonalization', payload: null }],
    [{ type: 'refreshFeed', payload: null }],
  );
});

it('should remove post from feed', () => {
  const state = {
    posts: [{
      id: '1',
    }, {
      id: '2',
    }, {
      id: '3',
    }],
  };
  module.mutations.removePost(state, '2');
  expect(state.posts).toEqual([{
    id: '1',
  }, {
    id: '3',
  }]);
});

it('should set sort by in state', () => {
  const state = {};
  module.mutations.setSortBy(state, 'popularity');
  expect(state.sortBy).toEqual('popularity');
});

it('should set sort by and refresh feed', async () => {
  const state = {};
  await testAction(
    module.actions.setSortBy,
    'creation',
    state,
    [{ type: 'setSortBy', payload: 'creation' }],
    [{ type: 'refreshFeed', payload: null }],
  );
});

it('should set search query in state', () => {
  const state = {};
  module.mutations.setSearch(state, 'java');
  expect(state.search).toEqual('java');
});

it('should set search and refresh feed', async () => {
  const state = { customPosts: ['a'], search: 'query' };
  await testAction(
    module.actions.search,
    'java',
    state,
    [{ type: 'setSearch', payload: 'java' }],
    [{ type: 'refreshFeed', payload: null }],
  );
});

it('should set empty search when no results', async () => {
  const state = { customPosts: [], search: 'query' };
  await testAction(
    module.actions.search,
    'java',
    state,
    [{
      type: 'setSearch',
      payload: 'java',
    }],
    [{ type: 'refreshFeed', payload: null }],
  );
});

it('should set ad in state when feed is empty', () => {
  const state = {posts: []};
  module.mutations.setAd(state, { ad: { title: 'Ad'}, type: 'posts' });
  expect(state.ad).toEqual({ title: 'Ad' });
});

it('should update ad in feed', () => {
  const state = {posts: [{type: 'ad', loading: true}]};
  module.mutations.setAd(state, { ad: { title: 'Ad'}, type: 'posts' });
  expect(state.posts).toEqual([{ type: 'ad', title: 'Ad' }]);
});

it('should set ad in state when all ads were loaded', () => {
  const state = {posts: [{type: 'ad', title: 'Ad'}]};
  module.mutations.setAd(state, { ad: { title: 'Ad2'}, type: 'posts' });
  expect(state.ad).toEqual({ title: 'Ad2' });
});

it('should fetch ads', async () => {
  monetizationService.fetchAd.mockReturnValue([{ title: 'ad' }]);
  const state = {};
  await testAction(
    module.actions.fetchAds,
    'posts',
    state,
    [{
      type: 'setAd',
      payload: { ad: {title: 'ad'}, type: 'posts' },
    }],
  );
});

it('should not find bookmarks conflicts', () => {
  const state = { bookmarks: [] };
  module.mutations.checkBookmarksConflicts(state);
  expect(state.conflictBookmarks).toEqual(undefined);
});

it('should find bookmarks conflicts', () => {
  const state = { bookmarks: [{ id: '1' }] };
  module.mutations.checkBookmarksConflicts(state);
  expect(state.conflictBookmarks).toEqual([{ id: '1' }]);
});

it('should clear bookmarks conflicts', () => {
  const state = { conflictBookmarks: [{ id: '1' }] };
  module.mutations.clearBookmarksConflicts(state);
  expect(state.conflictBookmarks).toEqual(null);
});

it('should merge bookmarks conflicts', () => {
  const state = {
    posts: [{ id: '1' }, { id: '2' }, { id: '3' }],
    conflictBookmarks: [{ id: '1' }, { id: '3' }],
  };
  module.mutations.mergeBookmarksConflicts(state);
  expect(state).toEqual({
    posts: [{ id: '1', bookmarked: true }, { id: '2' }, { id: '3', bookmarked: true }],
    conflictBookmarks: null,
  });
});

it('should merge bookmarks conflicts and set update to server', async () => {
  const state = {
    posts: [{ id: '1' }, { id: '2' }, { id: '3' }],
    conflictBookmarks: [{ id: '1' }, { id: '3' }],
  };
  await testAction(
    module.actions.mergeBookmarksConflicts,
    undefined,
    state,
    [{ type: 'mergeBookmarksConflicts' }],
  );
  expect(addBookmarksHandler)
    .toBeCalledWith({ data: { postIds: ['1', '3'] }});
});

it('should set posts by type', () => {
  const state = {};
  module.mutations.setPosts(state, {posts: [{ id: '1' }, { id: '2' }, { id: '3' }], type: 'posts'});
  expect(state.posts).toEqual([{ id: '1' }, { id: '2' }, { id: '3' }]);
});

it('should add posts by type', () => {
  const state = { posts: [{ id: '1' }] };
  module.mutations.addPosts(state, {posts: [{ id: '2' }, { id: '3' }], type: 'posts'});
  expect(state.posts).toEqual([{ id: '1' }, { id: '2' }, { id: '3' }]);
});

it('should not fetch next page when loading', async () => {
  const state = { loading: true };
  const res = await testAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    [],
  );
  expect(res).toEqual(false);
});

it('should not fetch next page when no more page', async () => {
  const state = { pageInfo: { hasNextPage: false } };
  const res = await testAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    [],
  );
  expect(res).toEqual(false);
});

it('should fetch anonymous feed', async () => {
  const now = new Date();
  MockDate.set(now);
  anonymousHandler.mockResolvedValue({ 
    data: {
      feed: {
        pageInfo: { hasNextPage: true, endCursor: 'cursor' },
        edges: [
          { node: { id: '1', source: { id: 's' }, createdAt: now.toISOString(), ratio: 2 } },
          { node: { id: '2', source: { id: 's' }, createdAt: now.toISOString(), ratio: 1 } },
        ],
      },
    },  
  });

  const state = { bookmarks: [{ id: '2' }], disabledPublications: [], enabledTags: [], latest: now, sortBy: 'popularity' };
  const res = await testAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    [
      { type: 'setLatest', payload: now },
      { type: 'setLoading', payload: true },
      { type: 'clearAd' },
      { type: 'setPosts', payload: { posts: [
        { type: 'ad', loading: true },
        { id: '1', publication: { id: 's' }, createdAt: now, size: 'small', bookmarked: false, url: 'http://localhost:4000/r/1' },
        { id: '2', publication: { id: 's' }, createdAt: now, size: 'medium', bookmarked: true, url: 'http://localhost:4000/r/2' },
      ], type: 'posts' } },
      { type: 'setLoading', payload: false },
      { type: 'setPageInfo', payload: { hasNextPage: true, endCursor: 'cursor' } },
    ],
    [
      { type: 'fetchAds', payload: 'posts' },
    ],
    {user: { }, ui: {} },
    { 'user/isLoggedIn': false },
  );
  expect(res).toEqual(true);
  expect(anonymousHandler).toBeCalledWith({ loggedIn: false, now, ranking: 'POPULARITY', filters: {excludeSources: undefined, includeTags: undefined}, after: undefined });
  MockDate.reset();
});

it('should fetch next anonymous feed page', async () => {
  const now = new Date();
  MockDate.set(now);
  anonymousHandler.mockResolvedValueOnce({ 
    data: {
      feed: {
        pageInfo: { hasNextPage: true, endCursor: 'cursor' },
        edges: [
          { node: { id: '1', source: { id: 's' }, createdAt: now.toISOString(), ratio: 2 } },
          { node: { id: '2', source: { id: 's' }, createdAt: now.toISOString(), ratio: 1 } },
        ],
      },
    },  
  });

  const state = { pageInfo: { hasNextPage: true, endCursor: 'cursor' }, bookmarks: [], posts: [], disabledPublications: [], enabledTags: [], latest: now, sortBy: 'popularity' };
  const res = await testAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    [
      { type: 'setLoading', payload: true },
      { type: 'clearAd' },
      { type: 'addPosts', payload: { posts: [
        { type: 'ad', loading: true },
        { id: '1', publication: { id: 's' }, createdAt: now, size: 'small', bookmarked: false, url: 'http://localhost:4000/r/1' },
        { id: '2', publication: { id: 's' }, createdAt: now, size: 'medium', bookmarked: false, url: 'http://localhost:4000/r/2' },
      ], type: 'posts' } },
      { type: 'setLoading', payload: false },
      { type: 'setPageInfo', payload: { hasNextPage: true, endCursor: 'cursor' } },
    ],
    [
      { type: 'fetchAds', payload: 'posts' },
    ],
    {user: { }, ui: {} },
    { 'user/isLoggedIn': false },
  );
  expect(res).toEqual(true);
  expect(anonymousHandler).toBeCalledWith({ loggedIn: false, now, ranking: 'POPULARITY', filters: {excludeSources: undefined, includeTags: undefined}, after: 'cursor' });
  MockDate.reset();
});

it('should apply local filters for anonymous feed', async () => {
  const now = new Date();
  MockDate.set(now);
  anonymousHandler.mockResolvedValueOnce(emptyFeed);

  const state = { bookmarks: [], disabledPublications: { b: true }, enabledTags: { javascript: true }, latest: now, sortBy: 'popularity' };
  const res = await runAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    {user: { }, ui: {} },
    { 'user/isLoggedIn': false },
  );
  expect(res).toEqual(true);
  expect(anonymousHandler).toBeCalledWith({ loggedIn: false, now, ranking: 'POPULARITY', filters: {excludeSources: ['b'], includeTags: ['javascript']}, after: undefined });
  MockDate.reset();
});

it('should fetch user feed', async () => {
  const now = new Date();
  MockDate.set(now);
  feedHandler.mockResolvedValueOnce(emptyFeed);

  const state = { bookmarks: [], latest: now, sortBy: 'creation' };
  const res = await runAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    {user: { }, ui: {} },
    { 'user/isLoggedIn': true },
  );
  expect(res).toEqual(true);
  expect(feedHandler).toBeCalledWith({ loggedIn: true, now, ranking: 'TIME', after: undefined });
  MockDate.reset();
});

it('should fetch user feed with only unread posts', async () => {
  const now = new Date();
  MockDate.set(now);
  feedHandler.mockResolvedValueOnce(emptyFeed);

  const state = { bookmarks: [], latest: now, sortBy: 'creation' };
  const res = await runAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    {user: { }, ui: { showOnlyNotReadPosts: true } },
    { 'user/isLoggedIn': true },
  );
  expect(res).toEqual(true);
  expect(feedHandler).toBeCalledWith({ loggedIn: true, now, ranking: 'TIME', after: undefined, unreadOnly: true });
  MockDate.reset();
});

it('should fetch user bookmarks', async () => {
  const now = new Date();
  MockDate.set(now);
  bookmarksHandler.mockResolvedValueOnce(emptyFeed);

  const state = { bookmarks: [], latest: now, sortBy: 'creation', showBookmarks: true };
  const res = await runAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    {user: { }, ui: {} },
    { 'user/isLoggedIn': true },
  );
  expect(res).toEqual(true);
  expect(bookmarksHandler).toBeCalledWith({ loggedIn: true, now, after: undefined });
  MockDate.reset();
});

it('should not fetch anything for anonymous bookmarks', async () => {
  const now = new Date();
  MockDate.set(now);

  const state = { bookmarks: [], latest: now, sortBy: 'creation', showBookmarks: true };
  const res = await runAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    { user: { profile: null, ui: {} } },
    { 'user/isLoggedIn': false },
  );
  expect(res).toEqual(false);
  MockDate.reset();
});

it('should fetch source feed', async () => {
  const now = new Date();
  MockDate.set(now);
  sourceFeedHandler.mockResolvedValueOnce(emptyFeed);

  const state = { bookmarks: [], latest: now, sortBy: 'popularity', filter: {type: 'publication', info: { id: 'a' } } };
  const res = await runAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    {user: { }, ui: {} },
    { 'user/isLoggedIn': true },
  );
  expect(res).toEqual(true);
  expect(sourceFeedHandler).toBeCalledWith({ loggedIn: true, now, after: undefined, ranking: 'TIME', source: 'a' });
  MockDate.reset();
});

it('should fetch tag feed', async () => {
  const now = new Date();
  MockDate.set(now);
  tagFeedHandler.mockResolvedValueOnce(emptyFeed);

  const state = { bookmarks: [], latest: now, sortBy: 'popularity', filter: {type: 'tag', info: { name: 'webdev' } } };
  const res = await runAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    {user: { }, ui: {} },
    { 'user/isLoggedIn': true },
  );
  expect(res).toEqual(true);
  expect(tagFeedHandler).toBeCalledWith({ loggedIn: true, now, after: undefined, ranking: 'TIME', tag: 'webdev' });
  MockDate.reset();
});

it('should search posts', async () => {
  const now = new Date();
  MockDate.set(now);
  searchPostHandler.mockResolvedValueOnce(emptyFeed);

  const state = { bookmarks: [], latest: now, search: 'node' };
  const res = await runAction(
    module.actions.fetchNextFeedPage,
    undefined,
    state,
    {user: { }, ui: {} },
    { 'user/isLoggedIn': true },
  );
  expect(res).toEqual(true);
  expect(searchPostHandler).toBeCalledWith({ loggedIn: true, now, after: undefined, query: 'node' });
  MockDate.reset();
});

it('should set bookmark list in state', () => {
  const state = {};
  module.mutations.setBookmarkList(state, 'id');
  expect(state.bookmarkList).toEqual('id');
});

it('should commit set bookmark list', async () => {
  const state = {};
  await testAction(module.actions.setBookmarkList, 'id', state,
    [{ type: 'setBookmarkList', payload: 'id' }],
    [], { user: { profile: null } },
  );
});

it('should commit set show bookmarks and refresh feed', async () => {
  const state = {};
  await testAction(module.actions.setBookmarkList, 'id', state,
    [{ type: 'setBookmarkList', payload: 'id' }],
    [{ type: 'refreshFeed' }],
    { user: { } },
    { 'user/isLoggedIn': true },
  );
});

it('should commit toggle bookmark', async () => {
  const state = {};
  const payload = { id: '1', bookmarked: true };
  await testAction(module.actions.toggleBookmarks, payload, state,
    [{ type: 'toggleBookmarks', payload }],
    [],
    { user: { } },
    { 'user/isLoggedIn': false },
  );
});

it('should send add bookmark request', async () => {
  const state = {};
  const payload = { id: '1', bookmarked: true };
  await testAction(module.actions.toggleBookmarks, payload, state,
    [{ type: 'toggleBookmarks', payload }],
    [],
    { user: { profile: { name: 'John' } } },
    { 'user/isLoggedIn': true },
  );
  expect(addBookmarksHandler).toBeCalledWith({ data: { postIds: ['1'] }});
});

it('should send remove bookmark request', async () => {
  const state = {};
  const payload = { id: '1', bookmarked: false };
  await testAction(module.actions.toggleBookmarks, payload, state,
    [{ type: 'toggleBookmarks', payload }],
    [],
    { user: { profile: { name: 'John' } } },
    { 'user/isLoggedIn': true },
  );
  expect(removeBookmarkHandler).toBeCalledWith({ id: '1' });
});

it('should add bookmark to list', async () => {
  const state = {};
  const payload = { post: { id: '1' }, list: { id: 'list' } };
  await testAction(module.actions.addBookmarkToList, payload, state,
    [{ type: 'toggleBookmarks', payload: { id: '1', bookmarked: true, list: { id: 'list' }}}],
    [],
    { user: { profile: { name: 'John' } } },
    { 'user/isLoggedIn': true },
  );
  expect(addBookmarkToListHandler).toBeCalledWith({ id: '1', listId: 'list' });
});

it('should add bookmark to default list', async () => {
  const state = {};
  const payload = { post: { id: '1' }, list: null };
  await testAction(module.actions.addBookmarkToList, payload, state,
    [{ type: 'toggleBookmarks', payload: { id: '1', bookmarked: true, list: null }}],
    [],
    { user: { profile: { name: 'John' } } },
  );
  expect(addBookmarkToListHandler).toBeCalledWith({ id: '1', listId: null });
});
