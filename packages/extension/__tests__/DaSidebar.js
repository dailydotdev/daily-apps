import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import svgicon from 'vue-svgicon';
import DaModeSwitch from '@daily/components/src/components/DaModeSwitch.vue';
import DaSidebar from '../src/components/DaSidebar.vue';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(svgicon);
localVue.component('da-mode-switch', DaModeSwitch);

let feed;
let store;

beforeEach(() => {
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
      setEnablePublication: jest.fn(),
      setTags: jest.fn(),
      setEnableTag: jest.fn(),
    },
    actions: {
      setFilter: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { feed },
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
      .find('.sidebar__sources .sidebar__content__enabled')
      .find('.sidebar__content__element__button').trigger('click');
    expect(feed.mutations.setEnablePublication)
      .toBeCalledWith(expect.anything(), { index: 0, enabled: false });
    done();
  });
});

it('should commit "setEnablePublication" when adding publication', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.filterChecked = false;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__sources .sidebar__content__disabled')
      .find('.sidebar__content__element__button').trigger('click');
    expect(feed.mutations.setEnablePublication)
      .toBeCalledWith(expect.anything(), { index: 1, enabled: true });
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

it('should commit "setEnableTag" when removing tag', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.filterChecked = true;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__tags .sidebar__content__enabled')
      .find('.sidebar__content__element__button').trigger('click');
    expect(feed.mutations.setEnableTag)
      .toBeCalledWith(expect.anything(), { index: 0, enabled: false });
    done();
  });
});

it('should commit "setEnableTag" when adding tag', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.filterChecked = true;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__tags .sidebar__content__disabled')
      .find('.sidebar__content__element__button').trigger('click');
    expect(feed.mutations.setEnableTag)
      .toBeCalledWith(expect.anything(), { index: 2, enabled: true });
    done();
  });
});

it('should activate request source form', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.$nextTick(() => {
    expect(wrapper.vm.requestActive).toEqual(false);
    wrapper
      .find('.sidebar__sources__activate-request').trigger('click');
    expect(wrapper.vm.requestActive).toEqual(true);
    done();
  });
});

it('should enable submit when input is a valid url', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.requestActive = true;
  wrapper.vm.$nextTick(() => {
    expect(wrapper.vm.disableSubmit).toEqual(true);
    wrapper.vm.$refs.request.value = 'https://dailynow.co';
    wrapper.find('.sidebar__sources__request').trigger('input');
    expect(wrapper.vm.disableSubmit).toEqual(false);
    done();
  });
});

it('should dispatch "setFilter" with publication filter', (done) => {
  const wrapper = mount(DaSidebar, { store, localVue });
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.sidebar__sources .sidebar__content__disabled')
      .find('.sidebar__content__element').trigger('click');
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
      .find('.sidebar__tags .sidebar__content__disabled')
      .find('.sidebar__content__element').trigger('click');
    expect(feed.actions.setFilter)
      .toBeCalledWith(expect.anything(), {
        type: 'tag',
        info: feed.state.tags[2],
      }, undefined);
    done();
  });
});
