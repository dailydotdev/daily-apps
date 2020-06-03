import Vue from 'vue';
import { apolloClient } from '../../apollo';
import { contentService, monetizationService } from '../../common/services';
import {
  FEED_QUERY,
  ANONYMOUS_FEED_QUERY,
  SOURCE_FEED_QUERY,
  TAG_FEED_QUERY,
  BOOKMARKS_FEED_QUERY,
  SEARCH_POSTS_QUERY,
} from '../../graphql/feed';
import {
  ADD_BOOKMARKS_MUTATION,
  REMOVE_BOOKMARK_MUTATION,
  ADD_BOOKMARK_TO_LIST_MUTATION,
} from '../../graphql/bookmarks';
import { mapPost } from '../../common/post';

const setPostBookmark = (state, key, id, value, list) => {
  const index = state[key].findIndex(post => post.id === id);
  if (index < 0) {
    return null;
  }
  Vue.set(state[key], index, { ...state[key][index], bookmarked: value, bookmarkList: list });
  return state[key][index];
};

const initialState = () => ({
  enabledTags: {},
  disabledPublications: {},
  showBookmarks: false,
  pageInfo: null,
  loading: false,
  posts: [],
  customPosts: [],
  bookmarks: [],
  latest: null,
  filter: null,
  sortBy: 'popularity',
  search: null,
  showFeed: true,
  daFeedRef: null,
  hoveredPost: null,
  ad: null,
  bookmarkList: null,
  lastUsedBookmarkList: null,
});

const isLoggedIn = state => !!state.user.profile;

const addBookmarked = (state, posts, loggedIn) => {
  if (!loggedIn && state.bookmarks) {
    return posts.map(post => ({
      ...post,
      bookmarked: state.bookmarks.findIndex(bookmark => bookmark.id === post.id) > -1,
    }));
  }

  return posts;
};

const fetchPosts = async (state, loggedIn, showOnlyNotReadPosts) => {
  const base = {
    loggedIn,
    now: state.latest,
    after: state.pageInfo ? state.pageInfo.endCursor : undefined,
  };

  if (state.showBookmarks) {
    if (loggedIn) {
      const variables = {};
      if (state.bookmarkList) {
        if (state.bookmarkList === 'unread') {
          variables.unreadOnly = true;
        } else {
          variables.listId = state.bookmarkList;
        }
      }
      return apolloClient.query({
        query: BOOKMARKS_FEED_QUERY,
        variables: {
          ...base,
          ...variables,
        },
        fetchPolicy: 'no-cache',
      });
    }
    return { data: { feed: { pageInfo: null, edges: [] } } };
  }

  if (state.filter) {
    if (state.filter.type === 'publication') {
      return apolloClient.query({
        query: SOURCE_FEED_QUERY,
        variables: {
          ...base,
          ranking: 'TIME',
          source: state.filter.info.id,
        },
        fetchPolicy: 'no-cache',
      });
    }

    return apolloClient.query({
      query: TAG_FEED_QUERY,
      variables: {
        ...base,
        ranking: 'TIME',
        tag: state.filter.info.name,
      },
      fetchPolicy: 'no-cache',
    });
  }

  if (state.search) {
    return apolloClient.query({
      query: SEARCH_POSTS_QUERY,
      variables: {
        ...base,
        query: state.search,
      },
      fetchPolicy: 'no-cache',
    });
  }

  const ranking = state.sortBy === 'popularity' ? 'POPULARITY' : 'TIME';

  if (loggedIn) {
    return apolloClient.query({
      query: FEED_QUERY,
      variables: {
        ...base,
        ranking,
        unreadOnly: showOnlyNotReadPosts,
      },
      fetchPolicy: 'no-cache',
    });
  }

  const pubs = Object.keys(state.disabledPublications);
  const tags = Object.keys(state.enabledTags);
  return apolloClient.query({
    query: ANONYMOUS_FEED_QUERY,
    variables: {
      ...base,
      ranking,
      filters: {
        excludeSources: pubs.length ? pubs : undefined,
        includeTags: tags.length ? tags : undefined,
      },
    },
    fetchPolicy: 'no-cache',
  });
};

const getFeed = (state) => {
  if (state.showBookmarks) {
    return 'bookmarks';
  }

  if (state.filter) {
    return 'customPosts';
  }

  if (state.search) {
    return 'customPosts';
  }

  return 'posts';
};

const setBookmarkInFeed = (state, id, bookmarked, list) => {
  const feed = getFeed(state);
  const post = setPostBookmark(state, feed, id, bookmarked, list);
  if (feed !== 'posts') {
    setPostBookmark(state, 'posts', id, bookmarked, list);
  }
  return post;
};

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    feed: state => state[getFeed(state)],
    emptyFeed: state => state[getFeed(state)].findIndex(p => p.type !== 'ad') < 0,
    hasFilter: (state) => {
      if (!state.filter) {
        return false;
      }

      if (state.filter.type === 'publication') {
        return !state.disabledPublications[state.filter.info.id];
      }
      return !!state.enabledTags[state.filter.info.name];
    },
    hasConflicts: state => state.conflictBookmarks && state.conflictBookmarks.length > 0,
  },
  mutations: {
    setHoveredPost(state, hoveredPost) {
      state.hoveredPost = hoveredPost;
    },
    setDaFeedReference(state, value) {
      state.daFeedRef = value;
    },
    setShowBookmarks(state, value) {
      state.showBookmarks = value;
      state.bookmarkList = null;
    },
    setDisabledPublications(state, ids) {
      state.disabledPublications = ids.reduce((acc, val) => ({ ...acc, [val]: true }), {});
    },
    enablePublication(state, { id, enabled }) {
      if (enabled) {
        Vue.delete(state.disabledPublications, id);
      } else {
        Vue.set(state.disabledPublications, id, true);
      }
    },
    setEnabledTags(state, names) {
      state.enabledTags = names.reduce((acc, val) => ({ ...acc, [val]: true }), {});
    },
    enableTag(state, { tag, enabled }) {
      if (enabled) {
        Vue.set(state.enabledTags, tag, true);
      } else {
        Vue.delete(state.enabledTags, tag);
      }
    },
    clearAd(state) {
      state.ad = null;
    },
    setAd(state, { ad, type }) {
      const feed = state[type];
      state.ad = ad;
      for (let i = feed.length - 1; i >= 0; i -= 1) {
        if (feed[i].type === 'ad') {
          if (feed[i].loading) {
            Vue.set(state[type], i, { ...ad, type: 'ad' });
            return;
          }
          break;
        }
      }
    },
    setPosts(state, { posts, type }) {
      state[type] = posts;
    },
    addPosts(state, { posts, type }) {
      if (posts && posts.length > 0) {
        state[type] = state[type].concat(posts);
      }
    },
    removePost(state, postId) {
      const feed = getFeed(state);
      const index = state[feed].findIndex(p => p.id === postId);
      state[feed].splice(index, 1);
    },
    setLatest(state, latest) {
      state.latest = latest;
    },
    setPageInfo(state, pageInfo) {
      state.pageInfo = pageInfo;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    toggleBookmarks(state, { id, bookmarked, list = null }) {
      if (bookmarked) {
        state.lastUsedBookmarkList = list;
      }

      const post = setBookmarkInFeed(state, id, bookmarked, list);

      const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
      if (!bookmarked || (state.bookmarkList && (!list || list.id !== state.bookmarkList))) {
        state.bookmarks.splice(index, 1);
      } else if (bookmarked) {
        if (index < 0) {
          state.bookmarks.unshift(post);
        } else {
          Vue.set(state.bookmarks, index, post);
        }
      }
    },
    setFilter(state, filter) {
      state.filter = filter;
    },
    resetFeed(state) {
      state.pageInfo = null;
      state.customPosts = [];
    },
    resetPersonalization(state) {
      state.filter = null;
      state.customPosts = [];
      state.bookmarks = [];
      state.disabledPublications = {};
      state.enabledTags = {};
      state.showBookmarks = false;
      state.bookmarkList = null;
    },
    setSortBy(state, sortBy) {
      state.sortBy = sortBy;
    },
    setSearch(state, search) {
      state.search = search;
    },
    setShowFeed(state, show) {
      state.showFeed = show;
    },
    checkBookmarksConflicts(state) {
      if (state.bookmarks.length) {
        state.conflictBookmarks = state.bookmarks;
      }
    },
    clearBookmarksConflicts(state) {
      state.conflictBookmarks = null;
    },
    mergeBookmarksConflicts(state) {
      state.conflictBookmarks.map(p => setBookmarkInFeed(state, p.id, true));
      state.conflictBookmarks = null;
    },
    setBookmarkList(state, id) {
      state.bookmarkList = id;
    },
  },
  actions: {
    async fetchNextFeedPage({
      dispatch, commit, state, rootState,
    }) {
      if (state.loading || (state.pageInfo && !state.pageInfo.hasNextPage)) {
        return false;
      }

      const loggedIn = !!rootState.user.profile;
      const type = getFeed(state);
      if (type === 'bookmarks' && !loggedIn) {
        return false;
      }

      if (!state.pageInfo) {
        commit('setLatest', new Date());
      }

      commit('setLoading', true);
      commit('clearAd');
      dispatch('fetchAds', type);

      const { showOnlyNotReadPosts } = rootState.ui;
      const res = await fetchPosts(state, loggedIn, showOnlyNotReadPosts);
      let posts = addBookmarked(state, res.data.feed.edges.map(e => mapPost(e.node)), loggedIn);
      if (state.ad) {
        posts = [{ ...state.ad, type: 'ad' }].concat(posts);
      } else {
        posts = [{ loading: true, type: 'ad' }].concat(posts);
      }

      if (!state.pageInfo) {
        commit('setPosts', { posts, type });
      } else {
        commit('addPosts', { posts, type });
      }

      commit('setLoading', false);
      commit('setPageInfo', res.data.feed.pageInfo);

      return true;
    },

    async setFilter({ commit, dispatch }, filter) {
      commit('setFilter', filter);
      return dispatch('refreshFeed');
    },

    async backToMainFeed({ commit, dispatch }) {
      commit('setSearch', null);
      return dispatch('setFilter', null);
    },

    addFilterToFeed({ dispatch, state }) {
      if (!state.filter) {
        return Promise.resolve();
      }

      if (state.filter.type === 'publication') {
        return dispatch('setEnablePublication', {
          id: state.filter.info.id,
          enabled: true,
        });
      }

      return dispatch('setEnableTag', {
        tag: state.filter.info.name,
        enabled: true,
      });
    },

    async refreshFeed({
      commit, dispatch, state, rootState,
    }) {
      if (!state.showBookmarks || rootState.user.profile) {
        commit('setShowFeed', false);
        commit('resetFeed');
        const res = await dispatch('fetchNextFeedPage');
        commit('setShowFeed', true);
        return res;
      }

      return false;
    },

    async setEnablePublication({
      commit, dispatch, rootState,
    }, payload) {
      commit('enablePublication', payload);

      if (isLoggedIn(rootState)) {
        // TODO: handle error
        await contentService.updateFeedPublications([{
          publicationId: payload.id,
          enabled: payload.enabled,
        }]);
      }

      return dispatch('refreshFeed');
    },

    async setEnableTag({ commit, dispatch, rootState }, payload) {
      commit('enableTag', payload);

      if (isLoggedIn(rootState)) {
        if (payload.enabled) {
          // TODO: handle error
          await contentService.addUserTags([payload.tag]);
        } else {
          // TODO: handle error
          await contentService.deleteUserTag(payload.tag);
        }
      }

      return dispatch('refreshFeed');
    },

    reset({ commit, dispatch }) {
      commit('resetPersonalization');
      return dispatch('refreshFeed');
    },

    setShowBookmarks({ commit, dispatch, rootState }, value) {
      commit('setShowBookmarks', value);
      if (rootState.user.profile) {
        return dispatch('refreshFeed');
      }

      return Promise.resolve();
    },

    setBookmarkList({ commit, dispatch, rootState }, id) {
      commit('setBookmarkList', id);
      if (rootState.user.profile) {
        return dispatch('refreshFeed');
      }

      return Promise.resolve();
    },

    setSortBy({ commit, dispatch }, value) {
      commit('setSortBy', value);
      return dispatch('refreshFeed');
    },

    search({ commit, dispatch }, value) {
      commit('setSearch', value);
      return dispatch('refreshFeed');
    },

    async fetchAds({ commit }, type) {
      try {
        const ads = await monetizationService.fetchAd();
        if (!ads.length) {
          ga('send', 'event', 'Ad', 'NotAvailable');
        } else {
          commit('setAd', { ad: ads[0], type });
        }
      } catch (err) {
        // TODO: handle error
      }
    },

    async mergeBookmarksConflicts({ commit, state }) {
      await apolloClient.mutate({
        mutation: ADD_BOOKMARKS_MUTATION,
        variables: { data: { postIds: state.conflictBookmarks.map(b => b.id) } },
      });
      commit('mergeBookmarksConflicts');
    },

    async toggleBookmarks({ commit, rootState }, { id, bookmarked }) {
      commit('toggleBookmarks', { id, bookmarked });
      if (isLoggedIn(rootState)) {
        try {
          if (bookmarked) {
            apolloClient.mutate({
              mutation: ADD_BOOKMARKS_MUTATION,
              variables: { data: { postIds: [id] } },
            });
          } else {
            apolloClient.mutate({
              mutation: REMOVE_BOOKMARK_MUTATION,
              variables: { id },
            });
          }
        } catch (err) {
          commit('toggleBookmarks', { id, bookmarked: !bookmarked });
        }
      }
    },

    async addBookmarkToList({ commit }, { post, list }) {
      commit('toggleBookmarks', { id: post.id, bookmarked: true, list });
      try {
        apolloClient.mutate({
          mutation: ADD_BOOKMARK_TO_LIST_MUTATION,
          variables: { id: post.id, listId: list ? list.id : null },
        });
        return true;
      } catch (err) {
        commit('toggleBookmarks', { id: post.id, bookmarked: post.bookmarked, list: post.bookmarkList });
        return false;
      }
    },
  },
};
