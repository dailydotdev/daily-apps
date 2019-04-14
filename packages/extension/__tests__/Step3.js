import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Step3 from '../src/routes/Step3.vue';

const router = new VueRouter();
const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

let ui;
let store;

beforeEach(() => {
  window.ga = () => {
  };

  ui = {
    namespaced: true,
    state: {
      onboarding: false,
    },
    mutations: {
      doneOnboarding: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { ui },
  });
});

it('should finish onboarding on button click', () => {
  const wrapper = shallowMount(Step3, {
    store,
    router,
    localVue,
  });

  wrapper.find('.btn').trigger('click');
  expect(ui.mutations.doneOnboarding).toBeCalledWith(expect.anything(), undefined);
});
