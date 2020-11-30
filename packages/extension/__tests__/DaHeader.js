import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import icons from '@daily/components/src/icons';
import { VTooltip } from 'v-tooltip';
import DaIconToggle from '@daily/components/src/components/DaIconToggle.vue';
import DaSwitch from '@daily/components/src/components/DaSwitch.vue';
import DaHeader from '../src/components/DaHeader.vue';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(icons);
localVue.directive('tooltip', VTooltip);
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
      showTopSites: true,
      minimalUi: false,
    },
    actions: {
      setShowTopSites: jest.fn(),
    },
    mutations: {
      hideNotifications: jest.fn(),
      showNotifications: jest.fn(),
      nextInstruction: jest.fn(),
    },
    getters: {
      topSitesInstructions: () => true,
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
      isPremium: state => !!state.profile && !!state.profile.premium,
    },
  };

  store = new Vuex.Store({
    modules: { ui, feed, user },
  });
});

it('should commit "setShowBookmarks" when switch is toggled', (done) => {
  const wrapper = mount(DaHeader, { store, localVue });
  wrapper.find('.header__switch').trigger('click');
  wrapper.find('.header__switch').find('.switch__handle').trigger('transitionend');
  wrapper.find('.header__switch').find('.switch__handle').trigger('transitionend');
  setTimeout(() => {
    expect(feed.actions.setShowBookmarks).toBeCalledWith(expect.anything(), true);
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

it('should emit "menu" on dnd-mode button click', () => {
  const wrapper = mount(DaHeader, { store, localVue });
  wrapper.find('button.btn-dnd').trigger('click');
  expect(wrapper.emitted().menu).toBeTruthy();
});

it('should set sign in button style to default while not in minimal ui mode', () => {
  const wrapper = mount(DaHeader, { store, localVue });
  expect(wrapper.find('.header__sign-in').classes()).toContain('btn-water-cheese');
});

it('should remove some buttons while in minimal ui mode', () => {
  ui.state.minimalUi = true;
  const wrapper = mount(DaHeader, { store, localVue });
  expect(wrapper.find('.header__switch').element).toBeFalsy();
  expect(wrapper.find('.header__cta').element).toBeFalsy();
  expect(wrapper.find('.separator').element).toBeFalsy();
  expect(wrapper.find('.btn-terminal').element).toBeFalsy();
  expect(wrapper.find('.btn-dnd').element).toBeFalsy();
  expect(wrapper.find('.btn-layout').element).toBeFalsy();
  expect(wrapper.find('.header__sign-in').classes()).toContain('btn-menu');
});
