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
} from '../../common/graphql';
import { mapPost } from '../../common/post';

const setPostBookmark = (state, key, id, value) => {
  const index = state[key].findIndex(post => post.id === id);
  if (index < 0) {
    return null;
  }
  Vue.set(state[key], index, { ...state[key][index], bookmarked: value });
  return state[key][index];
};

const initialState = () => ({
  tags: [],
  publications: [],
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
      return apolloClient.query({
        query: BOOKMARKS_FEED_QUERY,
        variables: {
          ...base,
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

  const pubs = state.publications.filter(p => !p.enabled).map(p => p.id);
  const tags = state.tags.filter(t => t.enabled).map(t => t.name);
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

const setBookmarkInFeed = (state, id, bookmarked) => {
  const feed = getFeed(state);
  const post = setPostBookmark(state, feed, id, bookmarked);
  if (feed !== 'posts') {
    setPostBookmark(state, 'posts', id, bookmarked);
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
        const pub = state.publications.find(p => p.id === state.filter.info.id);
        return pub && pub.enabled;
      }

      const tag = state.tags.find(t => t.name === state.filter.info.name);
      return tag && tag.enabled;
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
    },
    setPublications(state, pubs) {
      state.publications = pubs;
    },
    setEnablePublication(state, { index, enabled }) {
      Vue.set(state.publications, index, { ...state.publications[index], enabled });
    },
    setTags(state, tags) {
      state.tags = tags;
    },
    setEnableTag(state, { tag, enabled }) {
      const index = state.tags.findIndex(t => t.name === tag.name);
      if (index > -1) {
        Vue.set(state.tags, index,
          Object.assign({}, state.tags[index], { enabled }));
      } else {
        state.tags.push({ ...tag, enabled });
      }
    },
    clearAd(state) {
      state.ad = null;
    },
    setAd(state, { ad, type }) {
      const feed = state[type];
      for (let i = feed.length - 1; i >= 0; i -= 1) {
        if (feed[i].type === 'ad') {
          if (feed[i].loading) {
            Vue.set(state[type], i, { ...ad, type: 'ad' });
            return;
          }
          break;
        }
      }
      state.ad = ad;
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
    toggleBookmarks(state, { id, bookmarked }) {
      const post = setBookmarkInFeed(state, id, bookmarked);

      if (!bookmarked) {
        const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
        state.bookmarks.splice(index, 1);
      } else {
        state.bookmarks.unshift(post);
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
      state.publications = state.publications.map(p => ({ ...p, enabled: true }));
      state.tags = state.tags.map(t => ({ ...t, enabled: false }));
      state.showBookmarks = false;
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
  },
  actions: {
    async fetchPublications({ commit, state }) {
      const pubs = await contentService.fetchPublications();
      commit('setPublications', pubs.map((p) => {
        const index = state.publications.findIndex(p2 => p.id === p2.id);
        if (index < 0) {
          return p;
        }

        return { ...p, enabled: p.enabled && state.publications[index].enabled };
      }));
    },

    async fetchTags({ commit, state }) {
      const tags = await contentService.fetchPopularTags();
      const mergedTags = tags.reduce((acc, t) => {
        const index = acc.findIndex(t2 => t.name === t2.name);
        if (index < 0) {
          acc.push(t);
        } else {
          // eslint-disable-next-line no-param-reassign
          acc[index] = { ...t, enabled: t.enabled || state.tags[index].enabled };
        }
        return acc;
      }, state.tags);
      commit('setTags', mergedTags);
    },

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

    addFilterToFeed({ commit, dispatch, state }) {
      if (!state.filter) {
        return Promise.resolve();
      }

      if (state.filter.type === 'publication') {
        return Promise.resolve(commit('setEnablePublication', {
          index: state.publications.findIndex(p => p.id === state.filter.info.id),
          enabled: true,
        }));
      }

      return dispatch('setEnableTag', {
        tag: state.filter.info,
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
      commit, dispatch, state, rootState,
    }, payload) {
      commit('setEnablePublication', payload);

      if (isLoggedIn(rootState)) {
        // TODO: handle error
        await contentService.updateFeedPublications([{
          publicationId: state.publications[payload.index].id,
          enabled: payload.enabled,
        }]);
      }

      return dispatch('refreshFeed');
    },

    async setEnableTag({ commit, dispatch, rootState }, payload) {
      commit('setEnableTag', payload);

      if (isLoggedIn(rootState)) {
        if (payload.enabled) {
          // TODO: handle error
          await contentService.addUserTags([payload.tag.name]);
        } else {
          // TODO: handle error
          await contentService.deleteUserTag(payload.tag.name);
        }
      }

      return dispatch('refreshFeed');
    },

    reset({ commit, dispatch }) {
      commit('resetPersonalization');
      return dispatch('refreshFeed');
    },

    setShowBookmarks({ commit, dispatch, rootState }, value) {
      // TODO: add tests
      commit('setShowBookmarks', value);
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
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },

    async mergeBookmarksConflicts({ commit, state }) {
      await contentService.addBookmarks(state.conflictBookmarks.map(b => b.id));
      commit('mergeBookmarksConflicts');
    },
  },
};
