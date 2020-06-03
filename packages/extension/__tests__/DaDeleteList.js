import { mount, createLocalVue } from '@vue/test-utils';
import VueApollo from 'vue-apollo';
import icons from '@daily/components/src/icons';
import { apolloClient } from '../src/apollo';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import DaDeleteList from '../src/components/DaDeleteList.vue';
import { REMOVE_BOOKMARK_LIST_MUTATION } from '../src/graphql/bookmarkList';

jest.mock('../src/apollo');

let localVue = createLocalVue();

localVue.use(VueApollo);
localVue.use(icons);
localVue.component('da-modal', DaModal);
localVue.component('da-text-field', DaTextField);

const propsData = { list: { id: '1', name: 'list' } };

const removeBookmarkListHandler = jest.fn();
apolloClient.setRequestHandler(REMOVE_BOOKMARK_LIST_MUTATION, removeBookmarkListHandler);

beforeEach(() => {
  removeBookmarkListHandler.mockReset();
});

it('should emit close on close button click', () => {
  const wrapper = mount(DaDeleteList, { localVue, propsData });
  wrapper.find('.modal__close-btn').trigger('click');
  expect(wrapper.emitted().close[0]).toBeTruthy();
});

it('should emit close on cancel button click', () => {
  const wrapper = mount(DaDeleteList, { localVue, propsData });
  wrapper.find('.bookmark-modal__cancel').trigger('click');
  expect(wrapper.emitted().close[0]).toBeTruthy();
});

it('should delete the list', () => {
  removeBookmarkListHandler.mockResolvedValue({data: { removeBookmarkList: {_: true}}});
  const wrapper = mount(DaDeleteList, { localVue, propsData, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  wrapper.find('.bookmark-modal__confirm').trigger('click');
  expect(removeBookmarkListHandler).toBeCalledWith({ id: '1'});
});
