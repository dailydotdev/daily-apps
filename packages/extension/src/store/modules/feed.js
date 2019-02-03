import Vue from 'vue';
import { contentService } from '../../common/services';

const initialState = () => ({
  tags: [],
  publications: [],
  showBookmarks: false,
  page: 0,
  loading: false,
  posts: [],
  latest: null,
});

export default {
  namespaced: true,
  state: initialState(),
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
  },
  actions: {
    async fetchPublications({ commit }) {
      const pubs = await contentService.fetchPublications();
      commit('setPublications', pubs);
    },
    async fetchTags({ commit }) {
      commit('setTags', [{
        name: 'javascript',
        enabled: true,
      }, {
        name: 'linux',
        enabled: true,
      }, {
        name: 'product',
        enabled: false,
      }, {
        name: 'startup',
        enabled: false,
      }]);
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
