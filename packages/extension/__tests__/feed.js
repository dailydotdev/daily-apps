import module from '../src/store/modules/feed';

it('should set show bookmarks in state', () => {
  const state = {  };
  module.mutations.setShowBookmarks(state, true);
  expect(state.showBookmarks).toEqual(true);
});
