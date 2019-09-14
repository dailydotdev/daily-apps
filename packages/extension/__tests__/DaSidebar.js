import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import svgicon from 'vue-svgicon';
import VTooltip from 'v-tooltip';
import DaModeSwitch from '@daily/components/src/components/DaModeSwitch.vue';
import DaSidebar from '../src/components/DaSidebar.vue';
import { contentService } from '../src/common/services';

jest.mock('../src/common/services', () => ({
  contentService: {
    searchTags: jest.fn(),
    requestPublication: jest.fn(),
  },
}));

const REQUEST_URL = 'https://dailynow.co';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(svgicon);
localVue.use(VTooltip);
localVue.component('da-mode-switch', DaModeSwitch);

let feed;
let user;
let store;

beforeEach(() => {
  window.ga = () => {
  };

  feed = {
    namespaced: true,
    state: {
      publications: [{
        'id': 'airbnb',
        'name': 'Airbnb Engineering',
        'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/airbnb',
        'enabled': true,
        'twitter': 'AirbnbEng'
      }, {
        'id': 'alligator',
        'name': 'Alligator',
        'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/alligator',
        'enabled': false,
        'twitter': 'alligatorio'
      }, {
        'id': 'angular',
        'name': 'Angular',
        'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/angular',
        'enabled': false,
        'twitter': 'angular'
      }, {
        'id': 'aws',
        'name': 'AWS',
        'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/aws',
        'enabled': true,
        'twitter': 'awscloud'
      }],
      tags: [{
        'name': 'javascript',
        'enabled': true,
      }, {
        'name': 'linux',
        'enabled': true,
      }, {
        'name': 'startup',
        'enabled': false,
      }, {
        'name': 'product',
        'enabled': false,
      }],
    },
    mutations: {
      setPublications: jest.fn(),
      setTags: jest.fn(),
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
    },
  };

  store = new Vuex.Store({
    modules: { feed, user },
  });
});

it('should set enabledPubs according to state', () => {
  const wrapper = shallowMount(DaSidebar, { store, localVue });
  expect(wrapper.vm.enabledPubs).toEqual([{
    'id': 'airbnb',
    'name': 'Airbnb Engineering',
    'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/airbnb',
    'enabled': true,
    'twitter': 'AirbnbEng'
  }, {
    'id': 'aws',
    'name': 'AWS',
    'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/aws',
    'enabled': true,
    'twitter': 'awscloud'
  }]);
});

it('should set disabledPubs according to state', () => {
  const wrapper = shallowMount(DaSidebar, { store, localVue });
  expect(wrapper.vm.disabledPubs).toEqual([{
    'id': 'alligator',
    'name': 'Alligator',
    'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/alligator',
    'enabled': false,
    'twitter': 'alligatorio'
  }, {
    'id': 'angular',
    'name': 'Angular',
    'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/angular',
    'enabled': false,
    'twitter': 'angular'
  }]);
});

it('should commit "setEnablePublication" when removing publication', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.filterChecked = false;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__sources .sidebar__enabled')
      .find('.sidebar__element__button-hidden').trigger('click');
    expect(feed.actions.setEnablePublication)
      .toBeCalledWith(expect.anything(), { index: 0, enabled: false }, undefined);
    done();
  });
});

it('should commit "setEnablePublication" when adding publication', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.filterChecked = false;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__sources .sidebar__disabled')
      .find('.sidebar__element__button-hidden').trigger('click');
    expect(feed.actions.setEnablePublication)
      .toBeCalledWith(expect.anything(), { index: 1, enabled: true }, undefined);
    done();
  });
});

it('should set enabledTags according to state', () => {
  const wrapper = shallowMount(DaSidebar, { store, localVue });
  expect(wrapper.vm.enabledTags).toEqual([{
    'name': 'javascript',
    'enabled': true,
  }, {
    'name': 'linux',
    'enabled': true,
  }]);
});

it('should set disabledTags according to state', () => {
  const wrapper = shallowMount(DaSidebar, { store, localVue });
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
  wrapper.vm.filterChecked = true;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__tags .sidebar__enabled')
      .find('.sidebar__element__button-hidden').trigger('click');
    expect(feed.actions.setEnableTag)
      .toBeCalledWith(expect.anything(), { tag: feed.state.tags[0], enabled: false }, undefined);
    done();
  });
});

it('should commit "setEnableTag" when adding tag', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.filterChecked = true;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__tags .sidebar__disabled')
      .find('.sidebar__element__button-hidden').trigger('click');
    expect(feed.actions.setEnableTag)
      .toBeCalledWith(expect.anything(), { tag: feed.state.tags[2], enabled: true }, undefined);
    done();
  });
});

it('should activate request source form', (done) => {
  user.state.profile = { name: 'John' };
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.$nextTick(() => {
    expect(wrapper.vm.requestActive).toEqual(false);
    wrapper
      .find('.sidebar__sources__act-req').trigger('click');
    expect(wrapper.vm.requestActive).toEqual(true);
    done();
  });
});

describe('SUBMIT REQUEST', () => {
  let wrapper;
  beforeEach(() => {
    user.state.profile = { name: 'John' };
    wrapper = mount(DaSidebar, { store, localVue });
    wrapper.vm.requestActive = true;
  });

  it('should enable submit when input is a valid url', (done) => {
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.disableSubmit).toEqual(true);
      wrapper.vm.$refs.request.value = REQUEST_URL;
      wrapper.find('.sidebar__sources .sidebar__input').trigger('input');
      expect(wrapper.vm.disableSubmit).toEqual(false);
      done();
    });
  });

  it('should disable request input while the request is processed', (done) => {
    // Simulate delay
    contentService.requestPublication.mockReturnValue(new Promise(
      (resolve) => setTimeout(() => resolve(), 3000))
    );
    wrapper.vm.$nextTick(() => {
      wrapper.vm.$refs.request.value = REQUEST_URL;
      const sideBarSources = wrapper.find('.sidebar__sources');
      const sideBarSourcesInput = sideBarSources.find('.sidebar__input');
      sideBarSourcesInput.trigger('input');
      sideBarSources.find('.sidebar__sources__submit').trigger('click');
      expect(sideBarSourcesInput.attributes('disabled')).toBeTruthy();
      done();
    });
  });
});

it('should dispatch "setFilter" with publication filter', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__sources .sidebar__disabled')
      .find('.sidebar__element__button').trigger('click');
    expect(feed.actions.setFilter)
      .toBeCalledWith(expect.anything(), {
        type: 'publication',
        info: feed.state.publications[1],
      }, undefined);
    done();
  });
});

it('should dispatch "setFilter" with tag filter', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.filterChecked = true;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__tags .sidebar__disabled')
      .find('.sidebar__element__button').trigger('click');
    expect(feed.actions.setFilter)
      .toBeCalledWith(expect.anything(), {
        type: 'tag',
        info: feed.state.tags[2],
      }, undefined);
    done();
  });
});

it('should search for tags and update the tag list', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.filterChecked = true;
  wrapper.vm.$nextTick(() => {
    contentService.searchTags.mockReturnValue({
      query: 'java',
      hits: [{ name: 'javascript' }, { name: 'java' }],
    });
    wrapper.vm.$refs.search.value = 'java';
    wrapper.find('.sidebar__search .sidebar__input').trigger('input');
    wrapper.vm.$nextTick(() => {
      expect(contentService.searchTags).toBeCalledTimes(1);
      expect(contentService.searchTags).toBeCalledWith('java');
      expect(wrapper.vm.activeTags).toEqual([
        { name: 'javascript', enabled: true },
        { name: 'java', enabled: false },
      ]);
      done();
    });
  });
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
    const disabledPublicationsSelector = '.sidebar__sources .sidebar__disabled .sidebar__element.btn';
    const enabledPublicationsSelector = '.sidebar__sources .sidebar__enabled .sidebar__element.btn';
    const expected = feed.state.publications[1];
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
    const expected = feed.state.publications;
    wrapper.vm.query = '';

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredPublications).toBe(expected);
  });

  it('should display no publications if the input value does not match at all', async () => {
    const wrapper = mount(DaSidebar, { store, localVue });
    wrapper.vm.query = 'abcdefgh';

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredPublications.length).toBe(0);
  });
});
