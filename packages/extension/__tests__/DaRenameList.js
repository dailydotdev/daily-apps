import { mount, createLocalVue } from '@vue/test-utils';
import VueApollo from 'vue-apollo';
import icons from '@daily/components/src/icons';
import { apolloClient } from '../src/apollo';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import DaRenameList from '../src/components/DaRenameList.vue';
import { RENAME_BOOKMARK_LIST_MUTATION } from '../src/graphql/bookmarkList';

jest.mock('../src/apollo');

let localVue = createLocalVue();

localVue.use(VueApollo);
localVue.use(icons);
localVue.component('da-modal', DaModal);
localVue.component('da-text-field', DaTextField);

const propsData = { list: { id: '1', name: 'list' } };

const renameBookmarkListHandler = jest.fn();
apolloClient.setRequestHandler(RENAME_BOOKMARK_LIST_MUTATION, renameBookmarkListHandler);

beforeEach(() => {
  renameBookmarkListHandler.mockReset();
});

it('should emit close on close button click', () => {
  const wrapper = mount(DaRenameList, { localVue, propsData });
  wrapper.find('.modal__close-btn').trigger('click');
  expect(wrapper.emitted().close[0]).toBeTruthy();
});

it('should emit close on cancel button click', () => {
  const wrapper = mount(DaRenameList, { localVue, propsData });
  wrapper.find('.bookmark-modal__cancel').trigger('click');
  expect(wrapper.emitted().close[0]).toBeTruthy();
});

it('should autofocus on input', () => {
  const wrapper = mount(DaRenameList, { localVue, propsData });
  expect(wrapper.find('input').element.autofocus).toEqual(true);
});

it('should set input value to list name', () => {
  const wrapper = mount(DaRenameList, { localVue, propsData });
  expect(wrapper.find('input').element.value).toEqual('list');
});

it('should disable confirm button when input is empty', () => {
  const wrapper = mount(DaRenameList, { localVue, propsData });
  const input = wrapper.find('input');
  input.element.value = '';
  input.trigger('input');
  expect(wrapper.find('.bookmark-modal__confirm').element.disabled).toEqual(false);
});

it('should rename a list', () => {
  renameBookmarkListHandler.mockResolvedValue({data: { renameBookmarkList: {id: '1', name: 'name'}}});
  const wrapper = mount(DaRenameList, { localVue, propsData, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  const input = wrapper.find('input');
  input.element.value = 'name';
  input.trigger('input');
  wrapper.find('.bookmark-modal__confirm').trigger('click');
  expect(renameBookmarkListHandler).toBeCalledWith({ id: '1', name: 'name'});
});
