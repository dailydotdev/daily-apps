import { mount, createLocalVue } from '@vue/test-utils';
import VueApollo from 'vue-apollo';
import icons from '@daily/components/src/icons';
import { apolloClient } from '../src/apollo';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import DaCreateList from '../src/components/DaCreateList.vue';
import { CREATE_BOOKMARK_LIST_MUTATION } from '../src/graphql/bookmarkList';

jest.mock('../src/apollo');

let localVue = createLocalVue();

localVue.use(VueApollo);
localVue.use(icons);
localVue.component('da-modal', DaModal);
localVue.component('da-text-field', DaTextField);

const createBookmarkListHandler = jest.fn();
apolloClient.setRequestHandler(CREATE_BOOKMARK_LIST_MUTATION, createBookmarkListHandler);

beforeEach(() => {
  createBookmarkListHandler.mockReset();
});

it('should emit close on close button click', () => {
  const wrapper = mount(DaCreateList, { localVue });
  wrapper.find('.modal__close-btn').trigger('click');
  expect(wrapper.emitted().close[0]).toBeTruthy();
});

it('should autofocus on input', () => {
  const wrapper = mount(DaCreateList, { localVue });
  expect(wrapper.find('input').element.autofocus).toEqual(true);
});

it('should disable confirm button', () => {
  const wrapper = mount(DaCreateList, { localVue });
  expect(wrapper.find('.bookmark-modal__confirm').element.disabled).toEqual(true);
});

it('should enable confirm button when input is valid', () => {
  const wrapper = mount(DaCreateList, { localVue });
  const input = wrapper.find('input');
  input.element.value = 'name';
  input.trigger('input');
  expect(wrapper.find('.bookmark-modal__confirm').element.disabled).toEqual(false);
});

it('should create a new list', (done) => {
  createBookmarkListHandler.mockResolvedValue({data: { createBookmarkList: {id: '1', name: 'name'}}});
  const wrapper = mount(DaCreateList, { localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  const input = wrapper.find('input');
  input.element.value = 'name';
  input.trigger('input');
  wrapper.find('.bookmark-modal__confirm').trigger('click');
  expect(createBookmarkListHandler).toBeCalledWith({name: 'name'});
  setTimeout(() => {
    expect(wrapper.emitted().complete[0]).toEqual([{id: '1', name: 'name'}]);
    expect(wrapper.emitted().close[0]).toBeTruthy();
    done();
  });
});
