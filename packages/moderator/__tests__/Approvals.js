import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import svgicon from 'vue-svgicon';
import DaEditableText from '@daily/components/src/components/DaEditableText.vue';
import DaContext from '@daily/components/src/components/DaContext.vue';
import { createDummyEvent } from './fixtures/helpers';
import DmForm from '../src/components/DmForm.vue';
import Approvals from '../src/views/Approvals';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(svgicon);
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
      approvedRequests() {
        return [
          { id: 1, url: 'https://dailynow.co' },
          { id: 2, url: 'https://go.dailynow.co' },
        ];
      },
    },
    mutations: {},
    actions: {
      editOpenRequest: jest.fn(),
      declineOpenRequest: jest.fn(),
      uploadRequestLogo: jest.fn(),
      publishOpenRequest: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { requests },
  });
});

it('should open context menu on menu event', (done) => {
  const wrapper = mount(Approvals, {
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
  const wrapper = mount(Approvals, {
    localVue,
    store,
  });
  const form = wrapper.findAll('.form').at(1);
  form.vm.$emit('menu', createDummyEvent(form.element));
  setTimeout(() => {
    wrapper.find('.requests__context button').trigger('click');
    expect(requests.actions.declineOpenRequest)
      .toBeCalledWith(expect.anything(), { id: 2, reason: 'exists' }, undefined);
    done();
  }, 10);
});

it('should publish request on approve button click', () => {
  const wrapper = mount(Approvals, {
    localVue,
    store,
  });
  const form = wrapper.findAll('.form').at(0);
  form.vm.$emit('submit');
  expect(requests.actions.publishOpenRequest)
    .toBeCalledWith(expect.anything(), { id: 1 }, undefined);
});

it('should edit request url on editable submit', () => {
  const wrapper = mount(Approvals, {
    localVue,
    store,
  });
  const editable = wrapper.findAll('.form').at(0).findAll('.editable').at(1);
  editable.vm.$emit('submit', 'https://newurl.com');
  expect(requests.actions.editOpenRequest)
    .toBeCalledWith(expect.anything(), { id: 1, edit: { url: 'https://newurl.com' } }, undefined);
});

it('should upload logo when selecting file', () => {
  const wrapper = mount(Approvals, {
    localVue,
    store,
  });
  const input = wrapper.findAll('.form').at(0).find('.file-upload input');
  const file = new File(['foo'], 'file.txt');
  // Workaround to set read-only property files of input
  Object.defineProperty(input.element, 'files', {
    value: [file],
    writable: false,
  });

  input.trigger('input');
  expect(requests.actions.uploadRequestLogo)
    .toBeCalledWith(expect.anything(), { id: 1, file }, undefined);
});
