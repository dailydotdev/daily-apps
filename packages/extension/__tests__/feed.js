import module from '../src/store/modules/feed';
import { testAction } from './fixtures/helpers';
import { contentService } from '../src/common/services';

jest.mock('../src/common/services', () => ({
  contentService: {
    fetchPublications: jest.fn(),
  },
}));

it('should set show bookmarks in state', () => {
  const state = {};
  module.mutations.setShowBookmarks(state, true);
  expect(state.showBookmarks).toEqual(true);
});

it('should set publications in state', () => {
  const state = {};
  module.mutations.setPublications(state, []);
  expect(state.publications).toEqual([]);
});

it('should set enabled of specific publication in state', () => {
  const state = {
    publications: [{
      name: 'angular',
      enabled: true,
    }, {
      name: 'vue',
      enabled: false,
    }]
  };
  module.mutations.setEnablePublication(state, { index: 1, enabled: true });
  expect(state.publications).toEqual([{
    name: 'angular',
    enabled: true,
  }, {
    name: 'vue',
    enabled: true,
  }]);
});

it('should fetch publications and update state', async () => {
  const pubs = [{ name: 'angular', enabled: true }];
  contentService.fetchPublications.mockReturnValue(pubs);
  const state = { publications: [] };
  await testAction(module.actions.fetchPublications, undefined, state, [
    { type: 'setPublications', payload: pubs },
  ]);
  expect(contentService.fetchPublications).toBeCalledTimes(1);
});

it('should set tags in state', () => {
  const state = {};
  module.mutations.setTags(state, []);
  expect(state.tags).toEqual([]);
});

it('should set enabled of specific tag in state', () => {
  const state = {
    tags: [{
      name: 'angular',
      enabled: true,
    }, {
      name: 'vue',
      enabled: false,
    }]
  };
  module.mutations.setEnableTag(state, { index: 1, enabled: true });
  expect(state.tags).toEqual([{
    name: 'angular',
    enabled: true,
  }, {
    name: 'vue',
    enabled: true,
  }]);
});
