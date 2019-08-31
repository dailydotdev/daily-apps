import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import svgicon from 'vue-svgicon';
import { contentService } from '../src/common/services';
import Step2 from '../src/routes/Step2.vue';

jest.mock('../src/common/services', () => ({
  contentService: {
    searchTags: jest.fn(),
    fetchPopularTags: jest.fn(),
  },
}));

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);
localVue.use(svgicon);

let feed;
let store;

beforeEach(() => {
  window.ga = () => {
  };

  feed = {
    namespaced: true,
    state: {
      tags: [
        { name: 'angular', enabled: false },
        { name: 'vue', enabled: true },
      ],
    },
    actions: {
      setEnableTag: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { feed },
  });

  contentService.fetchPopularTags.mockReturnValue([
    { name: 'vue' },
    { name: 'node' },
    { name: 'javascript' },
    { name: 'python' },
    { name: 'docker' },
    { name: 'devops' },
  ]);
});

it('should fetch popular tags on mount', (done) => {
  const wrapper = shallowMount(Step2, {
    store,
    localVue,
  });

  wrapper.vm.$nextTick(() => {
    expect(contentService.fetchPopularTags).toBeCalledTimes(1);
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
    done();
  });
});

it('should enable tag when clicking on the relevant button', (done) => {
  const wrapper = shallowMount(Step2, {
    store,
    localVue,
  });

  wrapper.vm.$nextTick(() => {
    wrapper.find('.tags__buttons .btn').trigger('click');
    expect(feed.actions.setEnableTag)
      .toBeCalledWith(expect.anything(), { tag: feed.state.tags[1], enabled: false }, undefined);
    done();
  });
});

it('should search for tags on new search input', () => {
  contentService.searchTags.mockReturnValue({
    query: 'cl',
    hits: [
      { name: 'cloud' },
    ],
  });

  const wrapper = shallowMount(Step2, {
    store,
    localVue,
  });

  wrapper.vm.$refs.searchTags.value = 'cl';
  wrapper.find('input').trigger('input');
  expect(contentService.searchTags).toBeCalledWith('cl');
});

