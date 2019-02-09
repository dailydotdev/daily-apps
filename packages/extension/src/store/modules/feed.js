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
});

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
    showAd: state => !state.showBookmarks,
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
    setTags(state, tags) {
      state.tags = tags;
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
  },
  actions: {
    async fetchPublications({ commit }) {
      const pubs = await contentService.fetchPublications();
      commit('setPublications', pubs);
    },
    async fetchTags({ commit }) {
      const tags = (await contentService.fetchPopularTags()).map(t => ({ ...t, enabled: true }));
      commit('setTags', tags);
    },
    async fetchNextFeedPage({ commit, state }) {
      if (state.loading || state.page >= 5) {
        return false;
      }

      if (!state.page) {
        commit('setLatest', new Date());
      }

      commit('setLoading', true);

      const posts = await contentService.fetchLatestPosts(state.latest, state.page);

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
  },
};
