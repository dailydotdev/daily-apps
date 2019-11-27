import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import icons from '@daily/components/src/icons';
import DaEditableText from '@daily/components/src/components/DaEditableText.vue';
import DaContext from '@daily/components/src/components/DaContext.vue';
import { createDummyEvent } from './fixtures/helpers';
import DmForm from '../src/components/DmForm.vue';
import Requests from '../src/views/Requests.vue';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(icons);
localVue.component('da-editable-text', DaEditableText);
localVue.component('da-context', DaContext);
localVue.component('dm-form', DmForm);

let requests;
let store;

beforeEach(() => {
  requests = {
    namespaced: true,
    state: {
      reasons: [{
        id: 'exists',
        title: 'Already exists',
      }],
    },
    getters: {
      pendingRequests() {
        return [
          { id: 1, url: 'https://dailynow.co' },
          { id: 2, url: 'https://go.dailynow.co' },
        ];
      },
    },
    mutations: {},
    actions: {
      editOpenRequest: jest.fn(),
      approveOpenRequest: jest.fn(),
      declineOpenRequest: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { requests },
  });
});

it('should open context menu on menu event', (done) => {
  const wrapper = mount(Requests, {
    localVue,
    store,
  });
  expect(wrapper.find('.requests__context').element.style.display).toEqual('none');
  const form = wrapper.findAll('.form').at(1);
  form.vm.$emit('menu', createDummyEvent(form.element));
  setTimeout(() => {
    expect(wrapper.find('.requests__context').element.style.display)
      .not.toEqual('none');
    done();
  }, 10);
});

it('should decline request on content menu click', (done) => {
  const wrapper = mount(Requests, {
    localVue,
    store,
  });
  const form = wrapper.findAll('.form').at(1);
  form.vm.$emit('menu', createDummyEvent(form.element));
  setTimeout(() => {
    wrapper.find('.requests__context button').trigger('click');
    expect(requests.actions.declineOpenRequest)
      .toBeCalledWith(expect.anything(), { id: 2, reason: 'exists' });
    done();
  }, 10);
});

it('should approve request on approve button click', () => {
  const wrapper = mount(Requests, {
    localVue,
    store,
  });
  const form = wrapper.findAll('.form').at(0);
  form.vm.$emit('submit');
  expect(requests.actions.approveOpenRequest)
    .toBeCalledWith(expect.anything(), { id: 1 });
});

it('should edit request url on editable submit', () => {
  const wrapper = mount(Requests, {
    localVue,
    store,
  });
  const editable = wrapper.findAll('.form .editable').at(0);
  editable.vm.$emit('submit', 'https://newurl.com');
  expect(requests.actions.editOpenRequest)
    .toBeCalledWith(expect.anything(), { id: 1, edit: { url: 'https://newurl.com' } });
});
