const initialState = () => ({
  showBookmarks: false,
});

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setShowBookmarks(state, value) {
      state.showBookmarks = value;
    },
  },
};
