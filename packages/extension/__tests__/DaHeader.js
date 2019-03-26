import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import svgicon from 'vue-svgicon';
import DaIconToggle from '@daily/components/src/components/DaIconToggle.vue';
import DaSwitch from '@daily/components/src/components/DaSwitch.vue';
import DaHeader from '../src/components/DaHeader.vue';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(svgicon);
localVue.component('da-icon-toggle', DaIconToggle);
localVue.component('da-switch', DaSwitch);

let ui;
let feed;
let store;
let user;

beforeEach(() => {
  window.ga = () => {
  };

  ui = {
    namespaced: true,
    state: {
      theme: 'darcula',
      insaneMode: false,
      showTopSites: true,
    },
    actions: {
      setTheme: jest.fn(),
    },
    mutations: {
      setInsaneMode: jest.fn(),
      hideNotifications: jest.fn(),
      showNotifications: jest.fn(),
    },
  };

  feed = {
    namespaced: true,
    state: {
      showBookmarks: false,
    },
    actions: {
      setShowBookmarks: jest.fn(),
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
    modules: { ui, feed, user },
  });
});

it('should set theme according to state', () => {
  const wrapper = shallowMount(DaHeader, { store, localVue });
  expect(wrapper.vm.theme).toEqual(0);
});

it('should set theme button according to state', () => {
  const wrapper = shallowMount(DaHeader, { store, localVue });
  expect(wrapper.find('.header__theme').vm.pressed).toEqual(false);
  store.state.ui.theme = 'bright';
  expect(wrapper.find('.header__theme').vm.pressed).toEqual(true);
});

it('should dispatch "setTheme" when theme is changed', () => {
  const wrapper = mount(DaHeader, { store, localVue });
  wrapper.find('.header__theme').trigger('click');
  expect(ui.actions.setTheme).toBeCalledWith(expect.anything(), 'bright', undefined);
});

it('should set insane button according to state', () => {
  const wrapper = shallowMount(DaHeader, { store, localVue });
  expect(wrapper.find('.header__insane').vm.pressed).toEqual(false);
  store.state.ui.insaneMode = true;
  expect(wrapper.find('.header__insane').vm.pressed).toEqual(true);
});

it('should commit "setInsaneMode" when icon is clicked', () => {
  const wrapper = mount(DaHeader, { store, localVue });
  wrapper.find('.header__insane').trigger('click');
  expect(ui.mutations.setInsaneMode).toBeCalledWith(expect.anything(), true);
});

it('should commit "setShowBookmarks" when switch is toggled', (done) => {
  const wrapper = mount(DaHeader, { store, localVue });
  wrapper.find('.header__switch').trigger('click');
  wrapper.find('.header__switch').find('.switch__handle').trigger('transitionend');
  setTimeout(() => {
    expect(feed.actions.setShowBookmarks).toBeCalledWith(expect.anything(), true, undefined);
    done();
  }, 100);
});

it('should commit "showNotifications" when terminal button is clicked', (done) => {
  const wrapper = mount(DaHeader, { store, localVue });
  wrapper.find('.btn-terminal').trigger('click');
  setTimeout(() => {
    expect(ui.mutations.showNotifications).toBeCalledWith(expect.anything(), undefined);
    done();
  }, 100);
});

it('should commit "hideNotifications" when terminal button is clicked', (done) => {
  store.state.ui.showNotifications = true;
  const wrapper = mount(DaHeader, { store, localVue });
  wrapper.find('.btn-terminal').trigger('click');
  setTimeout(() => {
    expect(ui.mutations.hideNotifications).toBeCalledWith(expect.anything(), undefined);
    done();
  }, 100);
});

it('should emit "login" on sign-in button click', () => {
  const wrapper = mount(DaHeader, { store, localVue });
  wrapper.find('.header__sign-in').trigger('click');
  expect(wrapper.emitted().login[0]).toEqual([]);
});

it('should emit "profile" on profile button click', () => {
  const wrapper = mount(DaHeader, { store, localVue });
  store.state.user.profile = { image: 'http://image.com' };
  wrapper.find('.header__profile').trigger('click');
  expect(wrapper.emitted().profile[0]).toEqual([]);
});
