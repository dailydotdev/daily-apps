import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueApollo from 'vue-apollo';
import icons from '@daily/components/src/icons';
import tooltip from '@daily/components/src/directives/tooltip';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import DaDropdown from '@daily/components/src/components/DaDropdown.vue';
import { apolloClient } from '../src/apollo';
import DaIntegrations from '../src/components/DaIntegrations.vue';
import { POPULAR_INTEGRATIONS_QUERY, RSS_FEEDS_QUERY } from '../src/graphql/integrations';

jest.mock('../src/apollo');

let localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueApollo);
localVue.use(icons);
localVue.directive('tooltip', tooltip(localVue));
localVue.component('da-modal', DaModal);
localVue.component('da-text-field', DaTextField);
localVue.component('da-dropdown', DaDropdown);

const popularIntegrationsHandler = jest.fn();
const rssFeedsHandler = jest.fn();
apolloClient.setRequestHandler(POPULAR_INTEGRATIONS_QUERY, popularIntegrationsHandler);
apolloClient.setRequestHandler(RSS_FEEDS_QUERY, rssFeedsHandler);

let user;
let ui;
let store;

beforeEach(() => {
  window.ga = () => {
  };

  popularIntegrationsHandler.mockReset();
  popularIntegrationsHandler.mockResolvedValue({data: { popularIntegrations: [
    { logo: 'https://a.com/logo', title: 'A', subtitle: 'a', url: 'https://a.com' },
    { logo: 'https://b.com/logo', title: 'B', subtitle: 'b', url: 'https://b.com' },
  ]}});
  rssFeedsHandler.mockReset();
  rssFeedsHandler.mockResolvedValue({data: { rssFeeds: [
    { name: 'News feed', url: 'https://daily.dev/rss/news' },
    { name: 'Bookmarks', url: 'https://daily.dev/rss/bookmarks' },
  ]}});

  user = {
    namespaced: true,
    state: {
      profile: { premium: true },
    },
    getters: {
      isPremium: state => !!state.profile && !!state.profile.premium,
    },
  };

  ui = {
    namespaced: true,
    state: {},
    mutations: {
      setShowPremium: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { user, ui },
  });
});

it('should emit close on close button click', () => {
  const wrapper = mount(DaIntegrations, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  wrapper.find('.modal__close-btn').trigger('click');
  expect(wrapper.emitted().close[0]).toBeTruthy();
});

it('should show popular integrations', async () => {
  const wrapper = mount(DaIntegrations, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.integration__list').element).toMatchSnapshot();
});

it('should populate rss feeds in dropdown', async () => {
  const wrapper = mount(DaIntegrations, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  await wrapper.vm.$nextTick();
  expect(wrapper.vm.feeds).toMatchSnapshot();
});

it('should set url field value to first rss', async () => {
  const wrapper = mount(DaIntegrations, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.integration__url-box input').element.value).toEqual('https://daily.dev/rss/news');
});

it('should update url field value according to selection', async () => {
  const wrapper = mount(DaIntegrations, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  await wrapper.vm.$nextTick();
  wrapper.find('.dropdown').vm.$emit('selected', 1);
  expect(wrapper.find('.integration__url-box input').element.value).toEqual('https://daily.dev/rss/bookmarks');
});

it('should not show premium button when premium user', async () => {
  const wrapper = mount(DaIntegrations, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.integrations__btn').element).toBeFalsy();
});

it('should show premium popup when clicking on the premium button', async (done) => {
  user.state.profile.premium = false;
  const wrapper = mount(DaIntegrations, { store, localVue, apolloProvider: new VueApollo({defaultClient: apolloClient }) });
  await wrapper.vm.$nextTick();
  wrapper.find('.integrations__btn').trigger('click');
  setTimeout(() => {
    expect(wrapper.emitted().close[0]).toBeTruthy();
    expect(ui.mutations.setShowPremium).toBeCalledWith(expect.anything(), true);
    done();
  }, 100);
});