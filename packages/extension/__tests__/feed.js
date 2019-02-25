import module from '../src/store/modules/feed';
import { testAction } from './fixtures/helpers';
import { contentService } from '../src/common/services';

jest.mock('../src/common/services', () => ({
  contentService: {
    fetchPublications: jest.fn(),
    fetchPopularTags: jest.fn(),
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

it('should set filter in state', () => {
  const state = {};
  const filter = { type: 'publication', info: { id: 'angular', name: 'Angular' } };
  module.mutations.setFilter(state, filter);
  expect(state.filter).toEqual(filter);
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

it('should merge tags in state', () => {
  const state = { tags: [] };
  module.mutations.mergeTags(state, [{ name: 'java' }]);
  expect(state.tags).toEqual([{ name: 'java', enabled: false }]);
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

it('should set a post as bookmarked and add it to bookmarks', () => {
  const state = {
    posts: [{
      id: '1',
    }, {
      id: '2',
    }, {
      id: '3',
    }],
    bookmarks: [],
  };
  module.mutations.toggleBookmarks(state, { id: '2', bookmarked: true });
  expect(state.posts).toEqual([{
    id: '1',
  }, {
    id: '2',
    bookmarked: true,
  }, {
    id: '3',
  }]);
  expect(state.bookmarks).toEqual([{
    id: '2',
    bookmarked: true,
  }]);
});

it('should set a post as not bookmarked and remove it from bookmarks', () => {
  const state = {
    posts: [{
      id: '1',
      bookmarked: true,
    }, {
      id: '2',
    }, {
      id: '3',
      bookmarked: true,
    }],
    bookmarks: [{
      id: '1',
      bookmarked: true,
    }, {
      id: '3',
      bookmarked: true,
    }],
  };
  module.mutations.toggleBookmarks(state, { id: '3', bookmarked: false });
  expect(state.posts).toEqual([{
    id: '1',
    bookmarked: true,
  }, {
    id: '2',
  }, {
    id: '3',
    bookmarked: false
  }]);
  expect(state.bookmarks).toEqual([{
    id: '1',
    bookmarked: true,
  }]);
});

it('should fetch tags and update state', async () => {
  const tags = [{ name: 'javascript' }];
  contentService.fetchPopularTags.mockReturnValue(tags);
  const state = { tags: [] };
  await testAction(module.actions.fetchTags, undefined, state, [
    { type: 'mergeTags', payload: tags },
  ]);
  expect(contentService.fetchPopularTags).toBeCalledTimes(1);
});

it('should return hasFilter false when no filter', () => {
  const state = {
    filter: null,
  };
  const result = module.getters.hasFilter(state);
  expect(result).toEqual(false);
});

it('should return hasFilter true when publication exists and enabled', () => {
  const state = {
    publications: [{
      id: 'angular',
      enabled: true,
    }, {
      id: 'vue',
      enabled: false,
    }],
    filter: {
      type: 'publication',
      info: {
        id: 'angular',
      },
    },
  };
  const result = module.getters.hasFilter(state);
  expect(result).toEqual(true);
});

it('should return hasFilter false when publication exists and disabled', () => {
  const state = {
    publications: [{
      id: 'angular',
      enabled: true,
    }, {
      id: 'vue',
      enabled: false,
    }],
    filter: {
      type: 'publication',
      info: {
        id: 'vue',
      },
    },
  };
  const result = module.getters.hasFilter(state);
  expect(result).toEqual(false);
});

it('should return hasFilter true when tag exists and enabled', () => {
  const state = {
    tags: [{
      name: 'angular',
      enabled: true,
    }, {
      name: 'vue',
      enabled: false,
    }],
    filter: {
      type: 'tag',
      info: {
        name: 'angular',
      },
    },
  };
  const result = module.getters.hasFilter(state);
  expect(result).toEqual(true);
});

it('should return hasFilter false when tag exists and disabled', () => {
  const state = {
    tags: [{
      name: 'angular',
      enabled: true,
    }, {
      name: 'vue',
      enabled: false,
    }],
    filter: {
      type: 'tag',
      info: {
        name: 'vue',
      },
    },
  };
  const result = module.getters.hasFilter(state);
  expect(result).toEqual(false);
});

it('should reset feed', () => {
  const state = {
    posts: [{
      id: '1',
      bookmarked: true,
    }],
    page: 1,
  };
  module.mutations.resetFeed(state);
  expect(state.posts).toEqual([]);
  expect(state.page).toEqual(0);
});

it('should enable publication from filter', async () => {
  const state = {
    publications: [{
      id: 'angular',
      enabled: true,
    }, {
      id: 'vue',
      enabled: false,
    }],
    filter: {
      type: 'publication',
      info: {
        id: 'vue',
      },
    },
  };
  await testAction(module.actions.addFilterToFeed, undefined, state, [
    { type: 'setEnablePublication', payload: { index: 1, enabled: true } },
  ]);
});

it('should enable tag from filter', async () => {
  const state = {
    tags: [{
      name: 'angular',
      enabled: true,
    }, {
      name: 'vue',
      enabled: false,
    }],
    filter: {
      type: 'tag',
      info: {
        name: 'vue',
      },
    },
  };
  await testAction(module.actions.addFilterToFeed, undefined, state, [
    { type: 'setEnableTag', payload: { index: 1, enabled: true } },
  ]);
});
