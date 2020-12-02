import { mount, createLocalVue, config } from '@vue/test-utils';
import Vuex from 'vuex';
import VueApollo from 'vue-apollo';
import icons from '@daily/components/src/icons';
import { VTooltip } from 'v-tooltip';
import DaSearch from '@daily/components/src/components/DaSearch.vue';
import DaHome from '../src/routes/Home.vue';
import DaContext from '../../components/src/components/DaContext.vue';
import DaHeader from '../src/components/DaHeader.vue';
import DaSidebar from '../src/components/DaSidebar.vue';
import DaFeed from '../src/components/DaFeed.vue';
import { createDummyEvent } from './fixtures/helpers';
import { LATEST_NOTIFICATIONS_QUERY } from '../src/graphql/home';
import { SOURCES_QUERY } from '../src/graphql/sidebar';
import { apolloClient } from '../src/apollo';
import { POPULAR_TAGS_QUERY } from '../src/graphql/tags';
import { BOOKMARK_LISTS_QUERY } from '../src/graphql/bookmarkList';

jest.mock('../src/apollo');

config.stubs['transition'] = true;

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueApollo);
localVue.use(icons);
localVue.directive('tooltip', VTooltip);
localVue.component('da-search', DaSearch);
localVue.component('da-context', DaContext);
localVue.component('da-header', DaHeader);
localVue.component('da-sidebar', DaSidebar);
localVue.component('da-feed', DaFeed);
localVue.filter('provider', value => value);

let feed;
let ui;
let user;
let store;

beforeEach(() => {
  window.ga = () => {
  };

  feed = {
    namespaced: true,
    state: {
      publications: [],
      posts: [],
      showBookmarks: false,
      filter: null,
    },
    mutations: {
      setPublications: jest.fn(),
      setDaFeedReference: jest.fn(),
    },
    actions: {
      search: jest.fn(),
      fetchNextFeedPage: jest.fn(),
    },
    getters: {
      feed: state => state.posts,
      showAd: jest.fn(),
      emptyFeed: () => false,
      hasConflicts: () => false,
      hasFilter: () => false,
    },
  };

  ui = {
    namespaced: true,
    state: {
      insaneMode: false,
      showDndMenu: false,
      showUnlockUi: false,
    },
    mutations: {
      setDndModeTime: jest.fn(),
      setShowDndMenu: jest.fn(),
      updateNotificationBadge: jest.fn(),
      doneOnboarding: jest.fn(),
      unlockFullUi: jest.fn(),
    },
    getters: {
      topSitesInstructions: jest.fn(),
      sidebarInstructions: jest.fn(),
      showReadyModal: jest.fn(),
      dndMode: jest.fn(),
      dndModeTime: jest.fn(),
    },
    actions: {
      checkVisitWin: jest.fn(),
    }
  };

  user = {
    namespaced: true,
    state: {
      profile: null,
      readingRank: {
        rank: 0,
        progress: 0,
      },
    },
    getters: {
      isLoggedIn: state => !!state.profile,
      isPremium: state => !!state.profile && !!state.profile.premium,
    },
    actions: {
      validateAuth: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { feed, ui, user },
  });

  window.requestIdleCallback = jest.fn();
  window.IntersectionObserver = jest.fn();
});

it('should commit "setDndModeTime" when "For 1 Hour" or "Until Tomorrow" is clicked', () => {
  const wrapper = mount(DaHome, { store, localVue });
  wrapper.find('.dnd-context .btn-menu').trigger('click');
  expect(ui.mutations.setDndModeTime).toBeCalledWith(expect.anything(), expect.any(Number));
});

it('should close context menu when clicking two times on the DnD button', (done) => {
  const wrapper = mount(DaHome, { store, localVue });
  const header = wrapper.find('header');
  header.vm.$emit('menu', createDummyEvent(header.element));
  setTimeout(() => {
    expect(wrapper.vm.$refs.dndContext.$refs.context.show).toEqual(true);
    ui.state.showDndMenu = true;
    header.vm.$emit('menu', createDummyEvent(header.element));
    setTimeout(() => {
      expect(wrapper.vm.$refs.dndContext.$refs.context.show).toEqual(false);
      done();
    });
  }, 10);
});

it('should open search bar when clicking on the button', async () => {
  const wrapper = mount(DaHome, { store, localVue });
  expect(wrapper.find('.content__header .search').element).toBeUndefined();
  wrapper.find('.search-btn').trigger('click');
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.content__header .search').element).toBeTruthy();
});

it('should close search bar when switching to bookmarks', async () => {
  const wrapper = mount(DaHome, { store, localVue });
  wrapper.find('.search-btn').trigger('click');
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.content__header .search').element).toBeTruthy();
  feed.state.showBookmarks = true;
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.content__header .search').element).toBeUndefined();
});

it('should close search bar when setting filter', async () => {
  const wrapper = mount(DaHome, { store, localVue });
  wrapper.find('.search-btn').trigger('click');
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.content__header .search').element).toBeTruthy();
  feed.state.filter = { type: 'publication', info: { id: 'angular', name: 'Angular' } };
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.content__header .search').element).toBeUndefined();
});

it('should search query', async () => {
  const wrapper = mount(DaHome, { store, localVue });
  wrapper.find('.search-btn').trigger('click');
  await wrapper.vm.$nextTick();
  wrapper.find('.content__header .search').vm.$emit('submit', 'hello');
  expect(feed.actions.search).toBeCalledWith(expect.anything(), 'hello');
});

it('should show banner when data is available', (done) => {
  const wrapper = mount(DaHome, { store, localVue });
  wrapper.setData({
    banner: {
      timestamp: new Date(0),
      cta: 'Click here',
      subtitle: 'Sub',
      theme: 'gradient-bacon-onion',
      title: 'Title',
      url: 'https://daily.dev',
    },
  });
  setTimeout(() => {
    expect(wrapper.find('.banner')).toMatchSnapshot();
    done();
  });
});

it('should fetch notifications and update badge', (done) => {
  const now = new Date();
  apolloClient.setRequestHandler(SOURCES_QUERY, () => Promise.resolve({data: { sources: {} }}));
  apolloClient.setRequestHandler(POPULAR_TAGS_QUERY, () => Promise.resolve({data: { popularTags: {} }}));
  apolloClient.setRequestHandler(
    LATEST_NOTIFICATIONS_QUERY,
    () => Promise.resolve({ data: { latestNotifications: [{html: 'hello world', timestamp: now.toISOString()}] } }));
  apolloClient.setRequestHandler(BOOKMARK_LISTS_QUERY, () => Promise.resolve({data: {bookmarkLists: {}}}));
  const wrapper = mount(DaHome, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  wrapper.vm.$apollo.queries.notifications.setOptions({ fetchPolicy: 'network-only' });
  setTimeout(() => {
    expect(wrapper.vm.notifications).toEqual([{html: 'hello world', timestamp: now}]);
    expect(ui.mutations.updateNotificationBadge).toBeCalledWith(expect.anything(), now);
    done();
  });
});

it('should open integrations popup', async () => {
  const wrapper = mount(DaHome, { store, localVue });
  expect(wrapper.find('.integrations').element).toBeFalsy();
  wrapper.find('.integration-btn').trigger('click');
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.integrations').element).toBeTruthy();
});

it('should check visit win', (done) => {
  mount(DaHome, { store, localVue });
  setTimeout(() => {
    expect(ui.actions.checkVisitWin).toBeCalledTimes(1);
    done();
  });
});

it('should toggle sidebar', async () => {
  const wrapper = mount(DaHome, { store, localVue });
  expect(wrapper.find('.sidebar-container').classes()).not.toContain('opened');
  wrapper.find('.sidebar-trigger').trigger('click');
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.sidebar-container').classes()).toContain('opened');
  wrapper.find('.sidebar-trigger').trigger('click');
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.sidebar-container').classes()).not.toContain('opened');
});

it('should hide sidebar when showing bookmarks', async () => {
  feed.state.showBookmarks = true;
  const wrapper = mount(DaHome, { store, localVue });
  expect(wrapper.find('.sidebar-container').element.style.display).toEqual('none');
});

it('should not show welcome balloon by default', async () => {
  const wrapper = mount(DaHome, { store, localVue });
  expect(wrapper.find('.welcome-balloon').element).toBeFalsy();
});

it('should show welcome balloon during onboarding', async () => {
  ui.state.onboarding = true;
  const wrapper = mount(DaHome, { store, localVue });
  expect(wrapper.find('.welcome-balloon').element).toBeTruthy();
});

it('should open rank popup when clicking on the rank', async () => {
  ui.state.onboarding = true;
  const wrapper = mount(DaHome, { store, localVue });
  expect(wrapper.find('.rank-modal').element).toBeFalsy();
  wrapper.find('.rank-btn').trigger('click');
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.rank-modal').element).toBeTruthy();
});

it('should open rank popup when clicking on the rank', async () => {
  ui.state.onboarding = true;
  const wrapper = mount(DaHome, { store, localVue });
  expect(wrapper.find('.rank-modal').element).toBeFalsy();
  wrapper.find('.rank-btn').trigger('click');
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.rank-modal').element).toBeTruthy();
});

it('should finish onboarding when closing the rank popup', async () => {
  ui.state.onboarding = true;
  const wrapper = mount(DaHome, { store, localVue });
  wrapper.find('.rank-btn').trigger('click');
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
  wrapper.find('.rank-modal').vm.$emit('close');
  await wrapper.vm.$nextTick();
  expect(ui.mutations.doneOnboarding).toBeCalledTimes(1);
});

it('should show onboarding rank button during the onboarding', async () => {
  ui.state.onboarding = true;
  const wrapper = mount(DaHome, { store, localVue });
  expect(wrapper.find('.rank-btn').classes()).toContain('signal');
  expect(wrapper.find('.rank-btn .rank-progress').element).toBeFalsy();
  expect(wrapper.find('.rank-btn .rank-btn__inner').element).toBeTruthy();
});

it('should show regular rank button', async () => {
  const wrapper = mount(DaHome, { store, localVue });
  expect(wrapper.find('.rank-btn').classes()).not.toContain('signal');
  expect(wrapper.find('.rank-btn .rank-progress').element).toBeTruthy();
  expect(wrapper.find('.rank-btn .rank-btn__inner').element).toBeFalsy();
});

it('should unlock full ui when closing the unlock ui modal', async () => {
  ui.state.showUnlockUi = true;
  const wrapper = mount(DaHome, { store, localVue });
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.unlock-ui-modal').element).toBeTruthy();
  wrapper.find('.unlock-ui-modal').vm.$emit('close');
  await wrapper.vm.$nextTick();
  expect(ui.mutations.unlockFullUi).toBeCalledTimes(1);
});
