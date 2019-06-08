import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Home from '../src/views/Home.vue';

const localVue = createLocalVue();
let $router;
let requests;
let store;

beforeEach(() => {
  $router = { replace: jest.fn() };

  requests = {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
      fetchOpenRequests: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { requests },
  });
});

it('should set page to approvals on filter toggle', () => {
  const wrapper = shallowMount(Home, {
    localVue,
    store,
    mocks: { $router },
    stubs: ['router-link', 'router-view'],
    propsData: { showApprovals: false },
  });
  wrapper.find('.home__header').vm.$emit('filterToggle');
  expect($router.replace).toBeCalledWith('/approvals');
});

it('should set page to requests on filter toggle', () => {
  const wrapper = shallowMount(Home, {
    localVue,
    store,
    mocks: { $router },
    stubs: ['router-link', 'router-view'],
    propsData: { showApprovals: true },
  });
  wrapper.find('.home__header').vm.$emit('filterToggle');
  expect($router.replace).toBeCalledWith('/');
});
