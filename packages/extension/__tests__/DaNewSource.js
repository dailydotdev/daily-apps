import {mount, createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';
import VueApollo from 'vue-apollo';
import icons from '@daily/components/src/icons';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import DaSpinner from '@daily/components/src/components/DaSpinner.vue';
import {apolloClient} from '../src/apollo';
import {fetchTimeout} from '../src/common/fetch';
import {contentService} from '../src/common/services';
import DaNewSource from '../src/components/DaNewSource.vue';
import {SOURCE_BY_FEED_QUERY, ADD_PRIVATE_SOURCE_MUTATION} from '../src/graphql/newSource';

jest.mock('../src/apollo');
jest.mock('../src/common/fetch', () => ({
  fetchTimeout: jest.fn(),
}));
jest.mock('../src/common/services', () => ({
  contentService: {
    requestPublication: jest.fn(),
  },
}));

let localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueApollo);
localVue.use(icons);
localVue.component('da-modal', DaModal);
localVue.component('da-text-field', DaTextField);
localVue.component('da-spinner', DaSpinner);

const sourceByFeedHandler = jest.fn();
const addPrivateSourceHandler = jest.fn();
apolloClient.setRequestHandler(SOURCE_BY_FEED_QUERY, sourceByFeedHandler);
apolloClient.setRequestHandler(ADD_PRIVATE_SOURCE_MUTATION, addPrivateSourceHandler);

let user;
let ui;
let store;

beforeEach(() => {
  window.ga = () => {
  };

  sourceByFeedHandler.mockReset();
  sourceByFeedHandler.mockResolvedValue({data: {sourceByFeed: null}});
  addPrivateSourceHandler.mockReset();
  addPrivateSourceHandler.mockResolvedValue({
    data: {
      addPrivateSource: {
        id: 'id',
        name: 'Name',
        image: 'https://image.com',
        public: false,
      },
    },
  });

  user = {
    namespaced: true,
    state: {
      profile: {premium: true},
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
    modules: {user, ui},
  });
});

it('should emit close on close button click', () => {
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  wrapper.find('.modal__close-btn').trigger('click');
  expect(wrapper.emitted().close[0]).toBeTruthy();
});

it('should autofocus on input', () => {
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  expect(wrapper.find('input').element.autofocus).toEqual(true);
});

it('should disable confirm button', () => {
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  expect(wrapper.find('button[type="submit"]').element.disabled).toEqual(true);
});

it('should enable confirm button when input is valid', () => {
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  const input = wrapper.find('input');
  input.element.value = 'https://example.com';
  input.trigger('input');
  expect(wrapper.find('button[type="submit"]').element.disabled).toEqual(false);
});

it('should show error when cannot find rss', (done) => {
  fetchTimeout.mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      type: 'website',
      name: 'Example',
      logo: 'https://example.com/logo.png',
      rss: [],
    }),
  });
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  const input = wrapper.find('input');
  input.element.value = 'https://example.com';
  input.trigger('input');
  wrapper.find('button[type="submit"]').trigger('click');
  setTimeout(() => {
    expect(wrapper.find('.new-source__status').element).toMatchSnapshot();
    done();
  });
});

it('should show error when cannot scrape website', (done) => {
  fetchTimeout.mockResolvedValue({json: jest.fn().mockResolvedValue({type: 'unavailable'})});
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  const input = wrapper.find('input');
  input.element.value = 'https://example.com';
  input.trigger('input');
  wrapper.find('button[type="submit"]').trigger('click');
  setTimeout(() => {
    expect(wrapper.find('.new-source__status').element).toMatchSnapshot();
    done();
  });
});

it('should list scraped rss feeds', (done) => {
  fetchTimeout.mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      type: 'website',
      name: 'Example',
      logo: 'https://example.com/logo.png',
      rss: [{title: 'A', url: 'https://a.com/feed'}, {title: 'B', url: 'https://b.com/feed'}],
    }),
  });
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  const input = wrapper.find('input');
  input.element.value = 'https://example.com';
  input.trigger('input');
  wrapper.find('button[type="submit"]').trigger('click');
  setTimeout(() => {
    expect(wrapper.find('.new-source__status').element).toMatchSnapshot();
    expect(wrapper.find('.new-source__footer').element).toMatchSnapshot();
    done();
  });
});

it('should proceed directly to source info when one rss is available', (done) => {
  fetchTimeout.mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      type: 'website',
      name: 'Example',
      logo: 'https://example.com/logo.png',
      rss: [{title: 'A', url: 'https://a.com/feed'}],
    }),
  });
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  const input = wrapper.find('input');
  input.element.value = 'https://example.com';
  input.trigger('input');
  wrapper.find('button[type="submit"]').trigger('click');
  setTimeout(() => {
    expect(wrapper.find('.new-source__status').element).toMatchSnapshot();
    expect(wrapper.find('.new-source__footer').element).toMatchSnapshot();
    done();
  });
});

it('should show source exists message', async () => {
  fetchTimeout.mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      type: 'website',
      name: 'Example',
      logo: 'https://example.com/logo.png',
      rss: [{title: 'A', url: 'https://a.com/feed'}],
    }),
  });
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  wrapper.setData({
    existsSource: {
      id: 'source',
      name: 'Source',
      image: 'https://source.com/logo.png',
      public: true,
    },
  });
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.new-source__status').element).toMatchSnapshot();
  expect(wrapper.find('.new-source__footer').element).toMatchSnapshot();
});

it('should proceed to source info after selecting rss', async (done) => {
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  wrapper.setData({
    source: {
      type: 'website',
      name: 'Example',
      logo: 'https://example.com/logo.png',
      rss: [{title: 'A', url: 'https://a.com/feed', enabled: true}, {
        title: 'B',
        url: 'https://b.com/feed',
      }],
    },
  });
  wrapper.setData({scraped: true});
  await wrapper.vm.$nextTick();
  wrapper.find('.new-source__confirm').trigger('click');
  setTimeout(() => {
    expect(wrapper.find('.new-source__status').element).toMatchSnapshot();
    expect(wrapper.find('.new-source__footer').element).toMatchSnapshot();
    done();
  });
});

it('should request source', async (done) => {
  contentService.requestPublication.mockResolvedValue();
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  wrapper.setData({
    source: {
      type: 'website',
      name: 'Example',
      logo: 'https://example.com/logo.png',
      rss: [{title: 'A', url: 'https://a.com/feed', enabled: true}, {
        title: 'B',
        url: 'https://b.com/feed',
      }],
    },
  });
  wrapper.setData({scraped: true, validName: true, hasSelectedRSS: true});
  await wrapper.vm.$nextTick();
  wrapper.findAll('.new-source__submit button').at(0).trigger('click');
  await wrapper.vm.$nextTick();
  setTimeout(() => {
    expect(contentService.requestPublication).toBeCalledWith('https://a.com/feed');
    expect(wrapper.emitted().close[0]).toBeTruthy();
    expect(wrapper.emitted()['requested-source'][0]).toBeTruthy();
    done();
  }, 100);
});

it('should show premium popup', async (done) => {
  user.state.profile.premium = false;
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  wrapper.setData({
    source: {
      type: 'website',
      name: 'Example',
      logo: 'https://example.com/logo.png',
      rss: [{title: 'A', url: 'https://a.com/feed', enabled: true}, {
        title: 'B',
        url: 'https://b.com/feed',
      }],
    },
  });
  wrapper.setData({scraped: true, validName: true, hasSelectedRSS: true});
  await wrapper.vm.$nextTick();
  wrapper.findAll('.new-source__submit button').at(1).trigger('click');
  await wrapper.vm.$nextTick();
  setTimeout(() => {
    expect(ui.mutations.setShowPremium).toBeCalledWith(expect.anything(), true);
    expect(wrapper.emitted().close[0]).toBeTruthy();
    done();
  }, 100);
});

it('should add private source', async () => {
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  wrapper.setData({
    source: {
      type: 'website',
      name: 'Example',
      website: 'https://daily.dev',
      logo: 'https://example.com/logo.png',
      rss: [{title: 'A', url: 'https://a.com/feed'}, {title: 'B', url: 'https://b.com/feed'}],
    },
  });
  wrapper.setData({scraped: true, validName: true, hasSelectedRSS: true});
  await wrapper.vm.$nextTick();
  wrapper.findAll('.new-source__submit button').at(1).trigger('click');
  await wrapper.vm.$nextTick();
  expect(addPrivateSourceHandler).toBeCalledWith({
    data: {
      name: 'Example',
      website: 'https://daily.dev',
      image: 'https://example.com/logo.png',
      rss: 'https://a.com/feed',
    },
  });
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.new-source__header').element).toMatchSnapshot();
});

it('should add private source wit manually typed name', async () => {
  const wrapper = mount(DaNewSource, {
    store,
    localVue,
    apolloProvider: new VueApollo({defaultClient: apolloClient}),
  });
  wrapper.setData({
    source: {
      type: 'website',
      name: 'Example',
      website: 'https://daily.dev',
      logo: 'https://example.com/logo.png',
      rss: [{title: 'A', url: 'https://a.com/feed'}, {title: 'B', url: 'https://b.com/feed'}],
    },
  });
  wrapper.setData({scraped: true, validName: true, hasSelectedRSS: true});
  await wrapper.vm.$nextTick();
  const input = wrapper.find('.new-source__name input');
  input.element.value = 'My Source';
  input.trigger('input');
  wrapper.findAll('.new-source__submit button').at(1).trigger('click');
  await wrapper.vm.$nextTick();
  expect(addPrivateSourceHandler).toBeCalledWith({
    data: {
      name: 'My Source',
      website: 'https://daily.dev',
      image: 'https://example.com/logo.png',
      rss: 'https://a.com/feed',
    },
  });
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.new-source__header').element).toMatchSnapshot();
});
