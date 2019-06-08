import Vue from 'vue';
import { contentService } from '../../common/services';

const initialState = () => ({
  openRequests: [],
});

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    pendingRequests(state) {
      return state.openRequests.filter(req => req && !req.approved);
    },
    approvedRequests(state) {
      return state.openRequests.filter(req => req && req.approved);
    },
  },
  mutations: {
    setOpenRequests(state, requests) {
      state.openRequests = requests;
    },
    editOpenRequest(state, { index, edit }) {
      Vue.set(state.openRequests, index, Object.assign({}, state.openRequests[index], edit));
    },
    removeOpenRequest(state, index) {
      state.openRequests.splice(index, 1);
    },
    addOpenRequestToIndex(state, { index, request }) {
      state.openRequests.splice(index, 0, request);
    },
  },
  actions: {
    async fetchOpenRequests({ commit }) {
      const requests = await contentService.fetchOpenPubRequests();
      commit('setOpenRequests', requests);
    },
    async editOpenRequest({ commit, state }, { id, edit }) {
      const index = state.openRequests.findIndex(req => req.id === id);
      const old = state.openRequests[index];
      commit('editOpenRequest', { index, edit });
      try {
        await contentService.editPubRequest(id, edit);
      } catch {
        commit('editOpenRequest', { index, edit: old });
      }
    },
    async approveOpenRequest({ commit, state }, { id }) {
      const index = state.openRequests.findIndex(req => req.id === id);
      const old = state.openRequests[index];
      commit('editOpenRequest', { index, edit: { approved: true } });
      try {
        await contentService.approvePubRequest(id);
      } catch {
        commit('editOpenRequest', { index, edit: old });
      }
    },
    async declineOpenRequest({ commit, state }, { id, reason }) {
      const index = state.openRequests.findIndex(req => req.id === id);
      const old = state.openRequests[index];
      commit('removeOpenRequest', index);
      try {
        await contentService.declinePubRequest(id, reason);
      } catch {
        commit('addOpenRequestToIndex', { index, request: old });
      }
    },
  },
};
