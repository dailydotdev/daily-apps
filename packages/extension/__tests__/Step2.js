import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueApollo from 'vue-apollo';
import VueRouter from 'vue-router';
import icons from '@daily/components/src/icons';
import Step2 from '../src/routes/Step2.vue';
import { apolloClient } from '../src/apollo';
import { SEARCH_TAGS_QUERY, POPULAR_TAGS_QUERY } from '../src/graphql/tags';

jest.mock('../src/apollo');

const router = new VueRouter();
const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueApollo);
localVue.use(VueRouter);
localVue.use(icons);

let feed;
let ui;
let store;
let popularTagsHandler = jest.fn();
let searchTagsHandler = jest.fn();

apolloClient.setRequestHandler(POPULAR_TAGS_QUERY, popularTagsHandler);
apolloClient.setRequestHandler(SEARCH_TAGS_QUERY, searchTagsHandler);

beforeEach(() => {
  window.ga = () => {
  };

  feed = {
    namespaced: true,
    state: {
      enabledTags: { vue: true },
    },
    actions: {
      setEnableTag: jest.fn(),
    },
  };

  ui = {
    namespaced: true,
    state: {
      onboarding: false,
    },
    mutations: {
      doneOnboarding: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { feed, ui },
  });

  popularTagsHandler.mockReset();
  popularTagsHandler.mockResolvedValue({ data: { popularTags:
    [
      { name: 'vue' },
      { name: 'node' },
      { name: 'javascript' },
      { name: 'python' },
      { name: 'docker' },
      { name: 'devops' },
    ]
  }});
  searchTagsHandler.mockReset();
  searchTagsHandler.mockResolvedValue({ data: { searchTags: {
    query: 'cl',
    hits: [
      { name: 'cloud' },
    ],
  }}});
});

it('should fetch popular tags on mount', async () => {
  const wrapper = shallowMount(Step2, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient }),
  });
  expect(popularTagsHandler).toBeCalledTimes(1);
  await wrapper.vm.$nextTick();
  expect(wrapper.vm.activeCounter).toEqual(true);
  expect(wrapper.vm.disableButton).toEqual(true);
  expect(wrapper.vm.tags).toEqual([
    { name: 'vue', enabled: true },
    { name: 'node', enabled: false },
    { name: 'javascript', enabled: false },
    { name: 'python', enabled: false },
    { name: 'docker', enabled: false },
    { name: 'devops', enabled: false },
  ]);
});

it('should enable tag when clicking on the relevant button', async () => {
  const wrapper = shallowMount(Step2, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient }),
  });

  await wrapper.vm.$nextTick();
  wrapper.find('.tags__buttons .btn').trigger('click');
  expect(feed.actions.setEnableTag)
    .toBeCalledWith(expect.anything(), { tag: 'vue', enabled: false });
});

it('should search for tags on new search input', () => {
  const wrapper = shallowMount(Step2, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient }),
  });

  wrapper.vm.$refs.searchTags.value = 'cl';
  wrapper.find('input').trigger('input');
  expect(searchTagsHandler).toBeCalledWith({ query: 'cl' });
});

it('should skip onboarding on skip button click', () => {
  const wrapper = shallowMount(Step2, {
    store,
    router,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient }),
  });

  wrapper.find('.btn-skip').trigger('click');
  expect(ui.mutations.doneOnboarding).toBeCalledWith(expect.anything(), undefined);
});

