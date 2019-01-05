import Vue from 'vue';
import { contentService } from '../../common/services';

const initialState = () => ({
  tags: [],
  publications: [],
  showBookmarks: false,
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
  },
};
