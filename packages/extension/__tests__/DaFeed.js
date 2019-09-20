import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import svgicon from 'vue-svgicon';
import VTooltip from 'v-tooltip';
import { createDummyEvent } from './fixtures/helpers';
import { contentService } from '../src/common/services';
import DaFeed from '../src/components/DaFeed.vue';
import DaCardPost from '../../components/src/components/DaCardPost.vue';
import DaInsanePost from '../../components/src/components/DaInsanePost.vue';
import DaContext from '../../components/src/components/DaContext.vue';
import DaCardPlaceholder from '../../components/src/components/DaCardPlaceholder.vue';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(svgicon);
localVue.use(VTooltip);
localVue.component('da-card-post', DaCardPost);
localVue.component('da-insane-post', DaInsanePost);
localVue.component('da-context', DaContext);
localVue.component('da-card-placeholder', DaCardPlaceholder);

let feed;
let ui;
let user;
let store;

jest.mock('../src/common/services', () => ({
  contentService: {
    reportPost: jest.fn(),
    hidePost: jest.fn(),
  },
}));

beforeEach(() => {
  window.ga = () => {
  };

  feed = {
    namespaced: true,
    state: {
      publications: [{
        'id': 'devto',
        'name': 'DEV',
        'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/devto',
        'enabled': true,
        'twitter': '',
      }],
      posts: [{
        'id': '0b14843f08279a41ea69c1edd35a2c16',
        'title': 'Four Firefox Dev-Tools I use daily',
        'url': 'https://app.dailynow.co/r/0b14843f08279a41ea69c1edd35a2c16',
        'publishedAt': '2019-06-12T00:51:56.000Z',
        'createdAt': '2019-06-12T18:54:48.000Z',
        'publication': {
          'id': 'devto',
          'name': 'DEV',
          'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/devto',
        },
        'views': 130,
        'tags': [
          'webdev',
          'beginners',
          'css',
        ],
        'readTime': 4,
        'image': 'https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/5fdc29751a3ca792d72e6456016faf0f',
        'placeholder': 'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAFAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhAAAgIDAAAAAAAAAAAAAAAAAAECERMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAYH/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/ANWcpbTVcojkYATUyR//2Q==',
        'size': 'small',
      }],
    },
    mutations: {
      removePost: jest.fn(),
      toggleBookmarks: jest.fn(),
    },
    actions: {
      setFilter: jest.fn(),
    },
    getters: {
      feed: state => state['posts'],
      showAd: jest.fn(),
    },
  };

  ui = {
    namespaced: true,
    enableCardAnimations: true,
    state: {
      insaneMode: false,
    },
  };

  user = {
    namespaced: true,
    state: {
      profile: null,
    },
    getters: {
      isLoggedIn: state => !!state.profile,
    },
  };

  store = new Vuex.Store({
    modules: { feed, ui, user },
  });
});

it('should dispatch "setFilter" with publication filter', (done) => {
  const wrapper = mount(DaFeed, { store, localVue });
  const expectedPublication = feed.state.posts[0].publication;
  wrapper.vm.$nextTick(() => {
    wrapper
      .find('.card__footer__publication').trigger('click');
    expect(feed.actions.setFilter)
      .toBeCalledWith(expect.anything(), {
        type: 'publication',
        info: expectedPublication,
      }, undefined);
    done();
  });
});

it('should dispatch "setFilter" with publication filter when in insane mode', () => {
  const wrapper = mount(DaFeed, { store, localVue });
  const expectedPublication = feed.state.posts[0].publication;
  store.state.ui.insaneMode = true;
  wrapper
    .find('.insane__publication').trigger('click');
  expect(feed.actions.setFilter)
    .toBeCalledWith(expect.anything(), {
      type: 'publication',
      info: expectedPublication,
    }, undefined);
});

it('should not show menu button when logged out', () => {
  const wrapper = mount(DaFeed, { store, localVue });
  expect(wrapper.vm.$refs.posts[0].showMenu).toEqual(false);
});

it('should open context menu on menu button click', (done) => {
  const wrapper = mount(DaFeed, { store, localVue });
  store.state.user.profile = { name: 'daily' };
  wrapper.vm.$refs.posts[0].$emit('menu', {
    post: feed.state.posts[0],
    event: createDummyEvent(wrapper.vm.$refs.posts[0].$el),
  });
  setTimeout(() => {
    expect(wrapper.vm.$refs.context.$refs.context.show).toEqual(true);
    done();
  }, 10);
});

it('should report post', (done) => {
  const wrapper = mount(DaFeed, { store, localVue });
  contentService.reportPost.mockReturnValue(Promise.resolve());
  store.state.user.profile = { name: 'daily' };
  wrapper.vm.$refs.posts[0].$emit('menu', {
    post: feed.state.posts[0],
    event: createDummyEvent(wrapper.vm.$refs.posts[0].$el),
  });
  setTimeout(() => {
    wrapper.findAll('.feed__context .btn').at(0).trigger('click');
    expect(contentService.reportPost).toBeCalledWith(feed.state.posts[0].id, 'broken');
    done();
  }, 10);
});

it('should hide post', (done) => {
  const wrapper = mount(DaFeed, { store, localVue });
  contentService.hidePost.mockReturnValue(Promise.resolve());
  store.state.user.profile = { name: 'daily' };
  wrapper.vm.$refs.posts[0].$emit('menu', {
    post: feed.state.posts[0],
    event: createDummyEvent(wrapper.vm.$refs.posts[0].$el),
  });
  setTimeout(() => {
    wrapper.findAll('.feed__context .btn').at(2).trigger('click');
    expect(contentService.hidePost).toBeCalledWith(feed.state.posts[0].id);
    expect(feed.mutations.removePost)
      .toBeCalledWith(expect.anything(), feed.state.posts[0].id);
    done();
  }, 10);
});

it('should bookmark post', () => {
  const wrapper = mount(DaFeed, { store, localVue });
  wrapper.vm.$refs.posts[0].$emit('bookmark', {
    post: feed.state.posts[0],
    bookmarked: true,
  });
  expect(feed.mutations.toggleBookmarks)
    .toBeCalledWith(expect.anything(), { id: feed.state.posts[0].id, bookmarked: true });
});
