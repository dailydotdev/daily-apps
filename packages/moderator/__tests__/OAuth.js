import { createLocalVue, shallowMount } from '@vue/test-utils';
import OAuth from '../src/views/OAuth';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

let $route;
let $router;
let user;
let store;

beforeEach(() => {
  $route = { params: { provider: 'github' }, query: { code: '12345' } };
  $router = { replace: jest.fn() };

  user = {
    namespaced: true,
    state: {
      profile: null,
    },
    actions: {
      authenticate: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { user },
  });
});

it('should set page to approvals on filter toggle', (next) => {
  user.actions.authenticate.mockReturnValue(Promise.resolve());

  shallowMount(OAuth, {
    store,
    localVue,
    mocks: { $route, $router },
  });

  expect(user.actions.authenticate)
    .toBeCalledWith(expect.anything(), { provider: 'github', code: '12345' }, undefined);

  setTimeout(() => {
    expect($router.replace).toBeCalledWith('/');
    next();
  });
});
