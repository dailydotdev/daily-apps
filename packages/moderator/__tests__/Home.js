import { createLocalVue, shallowMount } from '@vue/test-utils';
import Home from '../src/views/Home.vue';

const localVue = createLocalVue();
let $router;

beforeEach(() => {
  $router = { replace: jest.fn() };
});

it('should set page to approvals on filter toggle', () => {
  const wrapper = shallowMount(Home, {
    localVue,
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
    mocks: { $router },
    stubs: ['router-link', 'router-view'],
    propsData: { showApprovals: true },
  });
  wrapper.find('.home__header').vm.$emit('filterToggle');
  expect($router.replace).toBeCalledWith('/');
});
