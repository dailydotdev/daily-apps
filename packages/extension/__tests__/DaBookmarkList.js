import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueApollo from 'vue-apollo';
import icons from '@daily/components/src/icons';
import tooltip from '@daily/components/src/directives/tooltip';
import { apolloClient } from '../src/apollo';
import DaBookmarkList from '../src/components/DaBookmarkList.vue';
import { BOOKMARK_LISTS_QUERY } from '../src/graphql/bookmarkList';

jest.mock('../src/apollo');

let localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueApollo);
localVue.use(icons);
localVue.directive('tooltip', tooltip(localVue));

const bookmarkListHandler = jest.fn();
apolloClient.setRequestHandler(BOOKMARK_LISTS_QUERY, bookmarkListHandler);

let feed;
let user;
let store;

beforeEach(() => {
  window.ga = () => {
  };
  
  feed = {
    namespaced: true,
    state: {
      bookmarkList: null,
    },
    actions: {
      setBookmarkList: jest.fn(),
    },
  };

  user = {
    namespaced: true,
    state: {
      profile: { premium: true },
    },
    getters: {
      isLoggedIn: state => !!state.profile,
      isPremium: state => !!state.profile && !!state.profile.premium,
    },
  };

  store = new Vuex.Store({
    modules: { feed, user },
  });

  bookmarkListHandler.mockReset();
  bookmarkListHandler.mockResolvedValue({data: {bookmarkLists: 
    [{id: '1', name: 'handbook'}, {id: '2', name: 'favorite'}]
  }});
});

it('should set active the default list', () => {
  const wrapper = mount(DaBookmarkList, { store, localVue });
  expect(wrapper.findAll('.btn.btn-menu').at(0).classes()).toContain('active');
});

it('should set active the unread list', () => {
  feed.state.bookmarkList = 'unread';
  const wrapper = mount(DaBookmarkList, { store, localVue });
  expect(wrapper.findAll('.btn.btn-menu').at(1).classes()).toContain('active');
});

it('should set active the custom list', async () => {
  feed.state.bookmarkList = '2';
  const wrapper = mount(DaBookmarkList, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  await wrapper.vm.$nextTick();
  expect(wrapper.findAll('.btn.btn-menu').at(3).classes()).toContain('active');
});

it('should dispatch setBookmarkList with no id', () => {
  const wrapper = mount(DaBookmarkList, { store, localVue });
  wrapper.findAll('.btn.btn-menu').at(0).trigger('click');
  expect(feed.actions.setBookmarkList).toBeCalledWith(expect.anything(), null);
});

it('should dispatch setBookmarkList with "unread" id', () => {
  const wrapper = mount(DaBookmarkList, { store, localVue });
  wrapper.findAll('.btn.btn-menu').at(1).trigger('click');
  expect(feed.actions.setBookmarkList).toBeCalledWith(expect.anything(), 'unread');
});

it('should dispatch setBookmarkList with the list id', async () => {
  const wrapper = mount(DaBookmarkList, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  await wrapper.vm.$nextTick();
  wrapper.findAll('.bookmark-list__list-btn').at(1).trigger('click');
  expect(feed.actions.setBookmarkList).toBeCalledWith(expect.anything(), '2');
});

it('should show custom user lists', async () => {
  const wrapper = mount(DaBookmarkList, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  await wrapper.vm.$nextTick();
  const lists = wrapper.findAll('.bookmark-list__list-btn');
  expect(lists.length).toEqual(2);
  const text = lists.wrappers.map(w => w.element.innerHTML);
  expect(text).toMatchSnapshot();
});

it('should open create list modal on plus button click', async () => {
  const wrapper = mount(DaBookmarkList, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  expect(wrapper.find('.create-list').element).toBeFalsy();
  await wrapper.vm.$nextTick();
  wrapper.find('.bookmark-list__header button').trigger('click');
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.create-list').element).toBeTruthy();
});

it('should open create list modal on dedicated button click', async () => {
  const wrapper = mount(DaBookmarkList, { store, localVue });
  expect(wrapper.find('.create-list').element).toBeFalsy();
  await wrapper.vm.$nextTick();
  wrapper.find('.bookmark-list__create-btn').trigger('click');
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.create-list').element).toBeTruthy();
});

it('should open context menu', async () => {
  const wrapper = mount(DaBookmarkList, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  expect(wrapper.find('.bookmark-list__context').element.style.display).toEqual('none');
  await wrapper.vm.$nextTick();
  wrapper.find('.bookmark-list__menu-btn').trigger('click');
  expect(wrapper.find('.bookmark-list__context').element.style.display).toEqual('none');
});

it('should open rename list modal', async () => {
  const wrapper = mount(DaBookmarkList, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  expect(wrapper.find('.rename-list').element).toBeFalsy();
  await wrapper.vm.$nextTick();
  wrapper.find('.bookmark-list__menu-btn').trigger('click');
  wrapper.find('.bookmark-list__context button').trigger('click');
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.rename-list').element).toBeTruthy();
});
