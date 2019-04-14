import Vue from 'vue';
import { contentService } from '../../common/services';

const setPostBookmark = (state, id, value) => {
  const index = state.posts.findIndex(post => post.id === id);
  Vue.set(state.posts, index, Object.assign({}, state.posts[index], { bookmarked: value }));
  return index;
};

const initialState = () => ({
  tags: [],
  publications: [],
  showBookmarks: false,
  page: 0,
  loading: false,
  posts: [],
  bookmarks: [],
  latest: null,
  filter: null,
});

const isLoggedIn = state => !!state.user.profile;

const addBookmarked = (state, posts, loggedIn) => {
  if (loggedIn) {
    if (state.showBookmarks) {
      return posts.map(post => ({ ...post, bookmarked: true }));
    }
  } else if (state.bookmarks) {
    return posts.map(post => ({
      ...post,
      bookmarked: state.bookmarks.findIndex(bookmark => bookmark.id === post.id) > -1,
    }));
  }

  return posts;
};

const fetchPosts = async (state, loggedIn) => {
  if (loggedIn && state.showBookmarks) {
    return contentService.fetchBookmarks(state.latest, state.page);
  }

  if (state.filter) {
    if (state.filter.type === 'publication') {
      return contentService.fetchPostsByPublication(state.latest, state.page, state.filter.info.id);
    }

    return contentService.fetchPostsByTag(state.latest, state.page, state.filter.info.name);
  }

  if (loggedIn) {
    return contentService.fetchLatestPosts(state.latest, state.page);
  }

  const enabledPubs = state.publications.filter(p => p.enabled).map(p => p.id);
  const pubs = enabledPubs.length === state.publications.length ? [] : enabledPubs;
  const tags = state.tags.filter(t => t.enabled).map(t => t.name);
  return contentService.fetchLatestPosts(state.latest, state.page, pubs, tags);
};

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    feed: (state) => {
      if (state.showBookmarks) {
        return state.bookmarks;
      }

      return state.posts;
    },
    showAd: state => !state.showBookmarks && !state.filter,
    hasFilter: (state) => {
      if (!state.filter) {
        return false;
      }

      if (state.filter.type === 'publication') {
        return state.publications.find(p => p.id === state.filter.info.id).enabled;
      }

      return state.tags.find(t => t.name === state.filter.info.name).enabled;
    },
  },
  mutations: {
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
    setPosts(state, { posts, type }) {
      // TODO: add tests
      state[type] = posts;
    },
    addPosts(state, { posts, type }) {
      // TODO: add tests
      state[type] = state[type].concat(posts);
    },
    setLatest(state, latest) {
      state.latest = latest;
    },
    setPage(state, page) {
      state.page = page;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    toggleBookmarks(state, { id, bookmarked }) {
      const postIndex = setPostBookmark(state, id, bookmarked);

      if (!bookmarked) {
        const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
        state.bookmarks.splice(index, 1);
      } else {
        state.bookmarks.unshift(state.posts[postIndex]);
      }
    },
    setFilter(state, filter) {
      state.filter = filter;
    },
    resetFeed(state) {
      state.page = 0;
      state.posts = [];
    },
    resetPersonalization(state) {
      // TODO: add tests
      state.filter = null;
      state.bookmarks = [];
      state.publications = state.publications.map(p => ({ ...p, enabled: true }));
      state.tags = state.tags.map(t => ({ ...t, enabled: false }));
      state.showBookmarks = false;
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

    async fetchNextFeedPage({ commit, state, rootState }) {
      // TODO: add tests
      if (state.loading) {
        return false;
      }

      if (!state.page) {
        commit('setLatest', new Date());
      }

      commit('setLoading', true);

      const type = state.showBookmarks ? 'bookmarks' : 'posts';
      const loggedIn = !!rootState.user.profile;
      // TODO: add tests addBookmarked
      const posts = addBookmarked(state, await fetchPosts(state, loggedIn), loggedIn);

      if (!state.page) {
        commit('setPosts', { posts, type });
      } else {
        commit('addPosts', { posts, type });
      }

      commit('setLoading', false);

      if (posts.length) {
        commit('setPage', state.page + 1);
      }

      return true;
    },

    async setFilter({ commit, dispatch }, filter) {
      commit('setFilter', filter);
      commit('resetFeed');
      return dispatch('fetchNextFeedPage');
    },

    async clearFilter({ dispatch }) {
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
      if (!state.filter && (!state.showBookmarks || rootState.user.profile)) {
        commit('resetFeed');
        return dispatch('fetchNextFeedPage');
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
  },
};
