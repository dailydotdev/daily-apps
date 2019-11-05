import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import svgicon from 'vue-svgicon';
import tooltip from '@daily/components/src/directives/tooltip';
import DaIconToggle from '@daily/components/src/components/DaIconToggle.vue';
import DaSwitch from '@daily/components/src/components/DaSwitch.vue';
import DaSettings from '../src/components/DaSettings.vue';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(svgicon);
localVue.directive('tooltip', tooltip);
localVue.component('da-icon-toggle', DaIconToggle);
localVue.component('da-switch', DaSwitch);

let ui;
let store;

beforeEach(() => {
  window.ga = () => {
  };

  ui = {
    namespaced: true,
    state: {
      theme: 'darcula',
      insaneMode: false,
      showTopSites: false,
      enabledCardAnimation: false,
    },
    actions: {
      setTheme: jest.fn(),
      setShowTopSites: jest.fn(),
    },
    mutations: {
      setInsaneMode: jest.fn(),
      setSpaciness: jest.fn(),
      setEnableCardAnimations: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { ui },
  });
});

it('should commit "setInsaneMode" when toggle is switched', () => {
  const wrapper = mount(DaSettings, { store, localVue });
  wrapper.find('.mode-switch').vm.$emit('toggle', true);
  expect(ui.mutations.setInsaneMode).toBeCalledWith(expect.anything(), true);
});

it('should commit "setSpaciness" when radio is toggled', () => {
  const wrapper = mount(DaSettings, { store, localVue });
  wrapper.find('.radio').vm.$emit('toggle', 'roomy');
  expect(ui.mutations.setSpaciness).toBeCalledWith(expect.anything(), 'roomy');
});

it('should dispatch "setShowTopSites" when setting is changed', () => {
  const wrapper = mount(DaSettings, { store, localVue });
  wrapper.find('.settings__top-sites').vm.$emit('toggle', true);
  expect(ui.actions.setShowTopSites).toBeCalledWith(expect.anything(), true, undefined);
});

it('should dispatch "setTheme" when theme is changed', () => {
  const wrapper = mount(DaSettings, { store, localVue });
  wrapper.find('.settings__theme').vm.$emit('toggle', true);
  expect(ui.actions.setTheme).toBeCalledWith(expect.anything(), 'bright', undefined);
});

it('should commit "setEnableCardAnimations" when setting is changed', () => {
  const wrapper = mount(DaSettings, { store, localVue });
  wrapper.find('.settings__animations').vm.$emit('toggle', true);
  expect(ui.mutations.setEnableCardAnimations).toBeCalledWith(expect.anything(), true);
});
