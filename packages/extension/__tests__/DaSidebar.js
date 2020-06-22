import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueApollo from 'vue-apollo';
import icons from '@daily/components/src/icons';
import tooltip from '@daily/components/src/directives/tooltip';
import DaModeSwitch from '@daily/components/src/components/DaModeSwitch.vue';
import DaSidebar from '../src/components/DaSidebar.vue';
import { apolloClient } from '../src/apollo';
import { SEARCH_TAGS_QUERY, POPULAR_TAGS_QUERY } from '../src/graphql/tags';
import { SOURCES_QUERY } from '../src/graphql/sidebar';

jest.mock('../src/apollo');

jest.mock('../src/common/services', () => ({
  contentService: {
    requestPublication: jest.fn(),
  },
}));

let localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueApollo);
localVue.use(icons);
localVue.directive('tooltip', tooltip(localVue));
localVue.component('da-mode-switch', DaModeSwitch);

let feed;
let user;
let ui;
let store;

const pubs = [{
  'id': 'airbnb',
  'name': 'Airbnb Engineering',
  'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/airbnb',
  'public': true,
}, {
  'id': 'alligator',
  'name': 'Alligator',
  'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/alligator',
  'public': true,
}, {
  'id': 'angular',
  'name': 'Angular',
  'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/angular',
  'public': true,
}, {
  'id': 'aws',
  'name': 'AWS',
  'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/aws',
  'public': true,
}];

const tags = [
  { 'name': 'javascript' },
  { 'name': 'linux' },
  { 'name': 'startup' },
  { 'name': 'product' },
];

beforeEach(() => {
  window.ga = () => {
  };

  feed = {
    namespaced: true,
    state: {
      disabledPublications: { alligator: true, angular: true },
      enabledTags: { javascript: true, linux: true, webdev: true },
    },
    actions: {
      setFilter: jest.fn(),
      setEnablePublication: jest.fn(),
      setEnableTag: jest.fn(),
    },
  };

  user = {
    namespaced: true,
    state: {
      profile: null,
    },
    getters: {
      isLoggedIn: state => !!state.profile,
      isPremium: state => !!state.profile && !!state.profile.premium,
    },
  };

  ui = {
    namespaced: true,
    state: {},
    mutations: {
      setShowNewSource: jest.fn(),
    },
  },

  store = new Vuex.Store({
    modules: { feed, user, ui },
  });
});

it('should set enabledPubs and disabledPubs according to state', () => {
  const wrapper = shallowMount(DaSidebar, { store, localVue });
  wrapper.setData({ rawPublications: pubs, rawTags: tags });
  expect(wrapper.vm.enabledPubs).toEqual([{
    'id': 'airbnb',
    'name': 'Airbnb Engineering',
    'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/airbnb',
    'enabled': true,
    'public': true,
  }, {
    'id': 'aws',
    'name': 'AWS',
    'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/aws',
    'enabled': true,
    'public': true,
  }]);
  expect(wrapper.vm.disabledPubs).toEqual([{
    'id': 'alligator',
    'name': 'Alligator',
    'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/alligator',
    'enabled': false,
    'public': true,
  }, {
    'id': 'angular',
    'name': 'Angular',
    'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/angular',
    'enabled': false,
    'public': true,
  }]);
});

it('should commit "setEnablePublication" when removing publication', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.setData({ rawPublications: pubs, rawTags: tags });
  wrapper.vm.filterChecked = false;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__sources .sidebar__enabled')
      .find('.sidebar__element__button-hidden').trigger('click');
    expect(feed.actions.setEnablePublication)
      .toBeCalledWith(expect.anything(), { id: pubs[0].id, enabled: false });
    done();
  });
});

it('should commit "setEnablePublication" when adding publication', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.setData({ rawPublications: pubs, rawTags: tags });
  wrapper.vm.filterChecked = false;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__sources .sidebar__disabled')
      .find('.sidebar__element__button-hidden').trigger('click');
    expect(feed.actions.setEnablePublication)
      .toBeCalledWith(expect.anything(), { id: pubs[1].id, enabled: true });
    done();
  });
});

it('should set enabledTags and disabledTags according to state', () => {
  const wrapper = shallowMount(DaSidebar, { store, localVue });
  wrapper.setData({ rawPublications: pubs, rawTags: tags });
  expect(wrapper.vm.enabledTags).toEqual([{
    'name': 'javascript',
    'enabled': true,
  }, {
    'name': 'linux',
    'enabled': true,
  }, {
    'name': 'webdev',
    'enabled': true,
  }]);
  expect(wrapper.vm.disabledTags).toEqual([{
    'name': 'startup',
    'enabled': false,
  }, {
    'name': 'product',
    'enabled': false,
  }]);
});

it('should dispatch "setEnableTag" when removing tag', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.setData({ rawPublications: pubs, rawTags: tags });
  wrapper.vm.filterChecked = true;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__tags .sidebar__enabled')
      .find('.sidebar__element__button-hidden').trigger('click');
    expect(feed.actions.setEnableTag)
      .toBeCalledWith(expect.anything(), { tag: tags[0].name, enabled: false });
    done();
  });
});

it('should commit "setEnableTag" when adding tag', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.setData({ rawPublications: pubs, rawTags: tags });
  wrapper.vm.filterChecked = true;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__tags .sidebar__disabled')
      .find('.sidebar__element__button-hidden').trigger('click');
    expect(feed.actions.setEnableTag)
      .toBeCalledWith(expect.anything(), { tag: tags[2].name, enabled: true });
    done();
  });
});

it('should activate request source form', async () => {
  user.state.profile = { name: 'John' };
  const wrapper = mount(DaSidebar, { store, localVue });
  await wrapper.vm.$nextTick();
  wrapper.find('.sidebar__sources__act-req').trigger('click');
  expect(ui.mutations.setShowNewSource).toBeCalledWith(expect.anything(), true);
});

it('should dispatch "setFilter" with publication filter', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.setData({ rawPublications: pubs, rawTags: tags });
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__sources .sidebar__disabled')
      .find('.sidebar__element__button').trigger('click');
    expect(feed.actions.setFilter)
      .toBeCalledWith(expect.anything(), {
        type: 'publication',
        info: { ...pubs[1], enabled: false },
      });
    done();
  });
});

it('should dispatch "setFilter" with tag filter', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.setData({ rawPublications: pubs, rawTags: tags });
  wrapper.vm.filterChecked = true;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__tags .sidebar__disabled')
      .find('.sidebar__element__button').trigger('click');
    expect(feed.actions.setFilter)
      .toBeCalledWith(expect.anything(), {
        type: 'tag',
        info: { ...tags[2], enabled: false },
      });
    done();
  });
});

it('should search for tags', async () => {
  const handler = jest.fn();
  apolloClient.setRequestHandler(SEARCH_TAGS_QUERY, handler);
  handler.mockResolvedValue({ data: { searchTags: {
    query: 'java',
    hits: [{ name: 'javascript' }, { name: 'java' }],
  }}});
  const wrapper = mount(DaSidebar, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  wrapper.vm.$apollo.queries.rawPublications.skip = true;
  wrapper.vm.$apollo.queries.rawTags.skip = true;
  wrapper.setData({ rawPublications: pubs, rawTags: tags });
  wrapper.vm.filterChecked = true;
  wrapper.vm.$refs.search.value = 'java';
  wrapper.find('.sidebar__search .sidebar__input').trigger('input');
  expect(handler).toBeCalledWith({ query: 'java' });
  await wrapper.vm.$nextTick();
  expect(wrapper.vm.activeTags).toEqual([
    { name: 'javascript', enabled: true },
    { name: 'java', enabled: false },
  ]);
});

it('should get the right placeholder name for the search input', async () => {
  let expected;

  const wrapper = mount(DaSidebar, { store, localVue });
  expected = 'Search Sources';

  expect(wrapper.vm.searchPlaceholder).toBe(expected);

  expected = 'Search Tags';
  wrapper.vm.filterChecked = true;
  await wrapper.vm.$nextTick();

  expect(wrapper.vm.searchPlaceholder).toBe(expected);
});

describe('SEARCH: Publications', () => {
  it('should filter publications depending on input value', async () => {
    const wrapper = mount(DaSidebar, { store, localVue });
    wrapper.setData({ rawPublications: pubs, rawTags: tags });
    const disabledPublicationsSelector = '.sidebar__sources .sidebar__disabled .sidebar__element.btn';
    const enabledPublicationsSelector = '.sidebar__sources .sidebar__enabled .sidebar__element.btn';
    const expected = pubs[1];
    wrapper.vm.query = 'all';

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredPublications[0].name).toBe(expected.name);
    expect(wrapper.findAll('.sidebar__sources .sidebar__disabled .sidebar__element.btn').length).toBe(1);

    wrapper.vm.query = 'a';

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.disabledPubs.length).toBe(2);
    expect(wrapper.findAll(disabledPublicationsSelector).length).toBe(2);

    expect(wrapper.vm.enabledPubs.length).toBe(2);
    expect(wrapper.findAll(enabledPublicationsSelector).filter(el => !el.classes('sidebar__sources__act-req')).length).toBe(2);
  });

  it('should display all the publications if the input value is empty', async () => {
    const wrapper = mount(DaSidebar, { store, localVue });
    wrapper.setData({ rawPublications: pubs, rawTags: tags });
    wrapper.vm.query = '';

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredPublications).toMatchSnapshot();
  });

  it('should display no publications if the input value does not match at all', async () => {
    const wrapper = mount(DaSidebar, { store, localVue });
    wrapper.vm.query = 'abcdefgh';

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredPublications.length).toBe(0);
  });
});

it('should emit loaded event when data was fetched', async () => {
  apolloClient.setRequestHandler(SOURCES_QUERY, () => Promise.resolve({data: {sources: {edges: [{node: {id: 'vue', image: 'image', name: 'Vue', public: true}}]}}}));
  apolloClient.setRequestHandler(POPULAR_TAGS_QUERY, () => Promise.resolve({data: { popularTags: [{name: 'webdev'}]}}));
  const wrapper = mount(DaSidebar, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  await wrapper.vm.$nextTick();
  expect(wrapper.emitted().loaded).toBeTruthy();
});
