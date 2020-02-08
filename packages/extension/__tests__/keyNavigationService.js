import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import icons from '@daily/components/src/icons';
import tooltip from '@daily/components/src/directives/tooltip';
import mdyDateFilter from '@daily/components/src/common/mdyDateFilter';
import DaFeed from '../src/components/DaFeed.vue';
import DaCardPost from '../../components/src/components/DaCardPost.vue';
import DaInsanePost from '../../components/src/components/DaInsanePost.vue';
import DaContext from '../../components/src/components/DaContext.vue';
import DaCardPlaceholder from '../../components/src/components/DaCardPlaceholder.vue';
import { navigateDaily, validKeys } from '../src/common/keyNavigationService';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(icons);
localVue.directive('tooltip', tooltip(localVue));
localVue.filter('mdyDate', mdyDateFilter);
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
const Parent = {
  methods: {
    enableSearch: jest.fn()
  },
  template: '<div />'
}

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
        'bookmarked': false,
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
      },{
        'id': '4b8055437fda150b933cad4568e05ae0',
        'title': 'Four Firefox Dev-Tools I use daily',
        'url': 'https://app.dailynow.co/r/0b14843f08279a41ea69c1edd35a2c16',
        'publishedAt': '2019-06-12T00:51:56.000Z',
        'bookmarked': false,
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
      },{
        'id': 'e44301f0c1a46491cc5cbef641077c55',
        'title': 'Four Firefox Dev-Tools I use daily',
        'url': 'https://app.dailynow.co/r/0b14843f08279a41ea69c1edd35a2c16',
        'publishedAt': '2019-06-12T00:51:56.000Z',
        'bookmarked': false,
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
      ads: [],
    },
    mutations: {
      removePost: jest.fn(),
      toggleBookmarks: jest.fn(),
    },
    actions: {
      setFilter: jest.fn(),
      fetchAds: jest.fn(),
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

describe('key events', () => {
  it('should hover post using "h, j, k, l" keys or do nothing when not applicable', () => {
    const wrapper = mount(DaFeed, { store, localVue });

    const initialPost = navigateDaily(wrapper.vm, null, validKeys.k);
    expect(initialPost.post.id).toEqual(wrapper.vm.$refs.posts[0].post.id);

    const goRight = navigateDaily(wrapper.vm, initialPost, validKeys.l);
    expect(goRight.post.id).toEqual(wrapper.vm.$refs.posts[2].post.id);

    const goLeft = navigateDaily(wrapper.vm, goRight, validKeys.h);
    expect(goLeft.post.id).toEqual(wrapper.vm.$refs.posts[0].post.id);

    const goDown = navigateDaily(wrapper.vm, goLeft, validKeys.j);
    expect(goDown.post.id).toEqual(wrapper.vm.$refs.posts[1].post.id);
  });

  it('should bookmark when "b" is pressed', () => {
    const wrapper = mount(DaFeed, { store, localVue });
    const posts = wrapper.vm.$refs.posts;

    navigateDaily(wrapper.vm, posts[0], validKeys.b);
    expect(feed.mutations.toggleBookmarks)
    .toBeCalledWith(expect.anything(), { id: posts[0].post.id, bookmarked: true });
  });
});
