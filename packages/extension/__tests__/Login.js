import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import DaSpinner from '@daily/components/src/components/DaSpinner.vue';
import Login from '../src/routes/Login.vue';

const router = new VueRouter();
const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);
localVue.component('da-spinner', DaSpinner);

let user;
let store;

beforeEach(() => {
  window.ga = () => {
  };

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

it('should authenticate user', async () => {
  const props = { provider: 'github', code: '12345' };
  mount(Login, {
    store,
    localVue,
    router,
    propsData: props,
  });
  expect(user.actions.authenticate)
    .toBeCalledWith(expect.anything(), props);
});
