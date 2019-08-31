import module from '../src/store/modules/feed';
import { testAction } from './fixtures/helpers';
import { contentService } from '../src/common/services';

jest.mock('../src/common/services', () => ({
  contentService: {
    fetchPublications: jest.fn(),
    fetchPopularTags: jest.fn(),
    updateFeedPublications: jest.fn(),
    addUserTags: jest.fn(),
    deleteUserTag: jest.fn(),
  },
}));

it('should set show bookmarks in state', () => {
  const state = {};
  module.mutations.setShowBookmarks(state, true);
  expect(state.showBookmarks).toEqual(true);
});

it('should commit set show bookmarks', async () => {
  const state = {};
  await testAction(module.actions.setShowBookmarks, true, state,
    [{ type: 'setShowBookmarks', payload: true }],
    [], { user: { profile: null } },
  );
});

it('should commit set show bookmarks and refresh feed', async () => {
  const state = {};
  await testAction(module.actions.setShowBookmarks, true, state,
    [{ type: 'setShowBookmarks', payload: true }],
    [{ type: 'refreshFeed' }],
    { user: { profile: { name: 'John' } } },
  );
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
    }],
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

it('should set enabled publication and refresh feed', async () => {
  const pubs = { index: 0, enabled: true };
  const state = {};
  await testAction(module.actions.setEnablePublication, pubs, state,
    [{ type: 'setEnablePublication', payload: pubs }],
    [{ type: 'refreshFeed' }], { user: { profile: null } });
});

it('should set enabled publication, refresh feed and update user', async () => {
  const pubs = { index: 0, enabled: true };
  const state = { publications: [{ id: 'angular' }] };
  await testAction(module.actions.setEnablePublication, pubs, state,
    [{ type: 'setEnablePublication', payload: pubs }],
    [{ type: 'refreshFeed' }], { user: { profile: { name: 'john' } } });
  expect(contentService.updateFeedPublications)
    .toBeCalledWith([{ publicationId: 'angular', enabled: true }]);
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

it('should set tags in state', () => {
  const state = { tags: [] };
  module.mutations.setTags(state, [{ name: 'java' }]);
  expect(state.tags).toEqual([{ name: 'java' }]);
});

it('should set enabled of specific tag in state', () => {
  const state = {
    tags: [{
      name: 'angular',
      enabled: true,
    }, {
      name: 'vue',
      enabled: false,
    }],
  };
  module.mutations.setEnableTag(state, { tag: state.tags[1], enabled: true });
  expect(state.tags).toEqual([{
    name: 'angular',
    enabled: true,
  }, {
    name: 'vue',
    enabled: true,
  }]);
});

it('should set enabled tag and refresh feed', async () => {
  const tags = { index: 0, enabled: true };
  const state = {};
  await testAction(module.actions.setEnableTag, tags, state,
    [{ type: 'setEnableTag', payload: tags }],
    [{ type: 'refreshFeed' }], { user: { profile: null } });
});

it('should set enabled tag, refresh feed and add user tag', async () => {
  const state = { tags: [{ name: 'angular' }] };
  const tags = { tag: state.tags[0], enabled: true };
  await testAction(module.actions.setEnableTag, tags, state,
    [{ type: 'setEnableTag', payload: tags }],
    [{ type: 'refreshFeed' }], { user: { profile: { name: 'john' } } });
  expect(contentService.addUserTags).toBeCalledWith(['angular']);
});

it('should set enabled tag, refresh feed and delete user tag', async () => {
  const state = { tags: [{ name: 'angular' }] };
  const tags = { tag: state.tags[0], enabled: false };
  await testAction(module.actions.setEnableTag, tags, state,
    [{ type: 'setEnableTag', payload: tags }],
    [{ type: 'refreshFeed' }], { user: { profile: { name: 'john' } } });
  expect(contentService.deleteUserTag).toBeCalledWith('angular');
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
    bookmarked: false,
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
    { type: 'setTags', payload: tags },
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
  expect(state.customPosts).toEqual([]);
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
        enabled: false,
      },
    },
  };
  await testAction(module.actions.addFilterToFeed, undefined, state,
    [],
    [{ type: 'setEnableTag', payload: { tag: state.tags[1], enabled: true } }]);
});

it('should reset personalization', () => {
  const state = {
    filter: { type: 'tag' },
    tags: [{
      name: 'angular',
      enabled: true,
    }, {
      name: 'vue',
      enabled: false,
    }],
    publications: [{
      id: 'angular',
      enabled: true,
    }, {
      id: 'vue',
      enabled: false,
    }],
    showBookmarks: true,
    bookmarks: [{
      id: '1',
      bookmarked: true,
    }, {
      id: '3',
      bookmarked: true,
    }],
  };
  module.mutations.resetPersonalization(state);
  expect(state.filter).toEqual(null);
  expect(state.tags).toEqual([{
    name: 'angular',
    enabled: false,
  }, {
    name: 'vue',
    enabled: false,
  }]);
  expect(state.publications).toEqual([{
    id: 'angular',
    enabled: true,
  }, {
    id: 'vue',
    enabled: true,
  }]);
  expect(state.showBookmarks).toEqual(false);
  expect(state.bookmarks).toEqual([]);
});

it('should reset everything', async () => {
  const state = {};
  await testAction(
    module.actions.reset,
    undefined,
    state,
    [{ type: 'resetPersonalization', payload: null }],
    [{ type: 'refreshFeed', payload: null }],
  );
});

it('should remove post from feed', () => {
  const state = {
    posts: [{
      id: '1',
    }, {
      id: '2',
    }, {
      id: '3',
    }],
  };
  module.mutations.removePost(state, '2');
  expect(state.posts).toEqual([{
    id: '1',
  }, {
    id: '3',
  }]);
});
