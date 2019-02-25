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

const addBookmarked = (state, posts) => {
  if (state.bookmarks) {
    return posts.map(post => ({
      ...post,
      bookmarked: state.bookmarks.findIndex(bookmark => bookmark.id === post.id) > -1,
    }));
  }

  return posts;
};

const fetchPosts = async (state) => {
  if (state.filter) {
    if (state.filter.type === 'publication') {
      return contentService.fetchPostsByPublication(state.latest, state.page, state.filter.info.id);
    }

    return contentService.fetchPostsByTag(state.latest, state.page, state.filter.info.name);
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
      Vue.set(state.publications, index,
        Object.assign({}, state.publications[index], { enabled }));
    },
    mergeTags(state, tags) {
      // TODO: add tests merge logic
      tags.forEach((t) => {
        const index = state.tags.findIndex(t2 => t.name === t2.name);
        if (index < 0) {
          state.tags.push({ ...t, enabled: !!t.enabled });
        }
      });
    },
    setEnableTag(state, { index, enabled }) {
      Vue.set(state.tags, index,
        Object.assign({}, state.tags[index], { enabled }));
    },
    setPosts(state, posts) {
      state.posts = posts;
    },
    addPosts(state, posts) {
      state.posts = state.posts.concat(posts);
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
  },
  actions: {
    async fetchPublications({ commit }) {
      const pubs = await contentService.fetchPublications();
      commit('setPublications', pubs);
    },
    async fetchTags({ commit }) {
      const tags = await contentService.fetchPopularTags();
      commit('mergeTags', tags);
    },
    async fetchNextFeedPage({ commit, state }) {
      // TODO: add tests
      if (state.loading) {
        return false;
      }

      if (!state.page) {
        commit('setLatest', new Date());
      }

      commit('setLoading', true);

      // TODO: add tests addBookmarked
      const posts = addBookmarked(state, await fetchPosts(state));

      if (!state.page) {
        commit('setPosts', posts);
      } else {
        commit('addPosts', posts);
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
    addFilterToFeed({ commit, state }) {
      if (!state.filter) {
        return;
      }

      if (state.filter.type === 'publication') {
        commit('setEnablePublication', {
          index: state.publications.findIndex(p => p.id === state.filter.info.id),
          enabled: true,
        });
      } else {
        commit('setEnableTag', {
          index: state.tags.findIndex(t => t.name === state.filter.info.name),
          enabled: true,
        });
      }
    },
    async refreshFeed({ commit, dispatch, state }) {
      if (!state.filter && !state.showBookmarks) {
        commit('resetFeed');
        return dispatch('fetchNextFeedPage');
      }

      return false;
    },
    async setEnablePublication({ commit, dispatch }, payload) {
      // TODO: add tests
      commit('setEnablePublication', payload);
      return dispatch('refreshFeed');
    },
    async setEnableTag({ commit, dispatch }, payload) {
      // TODO: add tests
      commit('setEnableTag', payload);
      return dispatch('refreshFeed');
    },
  },
};
