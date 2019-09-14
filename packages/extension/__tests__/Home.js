import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import svgicon from 'vue-svgicon';
import VTooltip from 'v-tooltip';
import DaHome from '../src/routes/Home.vue';
import DaCardPost from '../../components/src/components/DaCardPost.vue';
import DaInsanePost from '../../components/src/components/DaInsanePost.vue';
import DaContext from '../../components/src/components/DaContext.vue';
import DaCardPlaceholder from '../../components/src/components/DaCardPlaceholder.vue';
import DaHeader from '../src/components/DaHeader.vue';
import DaSidebar from '../src/components/DaSidebar.vue';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(svgicon);
localVue.use(VTooltip);
localVue.component('da-card-post', DaCardPost);
localVue.component('da-insane-post', DaInsanePost);
localVue.component('da-context', DaContext);
localVue.component('da-card-placeholder', DaCardPlaceholder);
localVue.component('da-header', DaHeader);
localVue.component('da-sidebar', DaSidebar);

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
      publications: [{
        'id': 'devto',
        'name': 'DEV',
        'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/devto',
        'enabled': true,
        'twitter': ''
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
          'image': 'https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/logos/devto'
        },
        'views': 130,
        'tags': [
          'webdev',
          'beginners',
          'css'
        ],
        'readTime': 4,
        'image': 'https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/5fdc29751a3ca792d72e6456016faf0f',
        'placeholder': 'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAFAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhAAAgIDAAAAAAAAAAAAAAAAAAECERMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAYH/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/ANWcpbTVcojkYATUyR//2Q==',
        'size': 'small'
      }]
    },
    mutations: {
      setPublications: jest.fn()
    },
    actions: {
      setFilter: jest.fn()
    },
    getters: {
      feed: state => state['posts'],
      showAd: jest.fn()
    }
  };

  ui = {
    namespaced: true,
    enableCardAnimations: true,
    instructionsStep: 0,
    state: {
      insaneMode: false,
    },
    mutations: {
      setInsaneMode: jest.fn(),
      setDndModeTime: jest.fn(),
      setShowDndMenu: jest.fn(),
    },
    getters: {
      topSitesInstructions: jest.fn(),
      sidebarInstructions: jest.fn(),
      showReadyModal: jest.fn(),
      dndMode: jest.fn(),
      dndModeTime: jest.fn(),
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
    actions: {
      refreshToken: jest.fn()
    }
  };

  store = new Vuex.Store({
    modules: { feed, ui, user },
  });

  window.requestIdleCallback = jest.fn();
  window.IntersectionObserver = jest.fn();
});

it('should dispatch "setFilter" with publication filter', (done) => {
  const wrapper = mount(DaHome, { store, localVue });
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

it('should dispatch "setFilter" with publication filter when in insane mode', (done) => {
  const wrapper = mount(DaHome, { store, localVue });
  const expectedPublication = feed.state.posts[0].publication;
  store.state.ui.insaneMode = true;
  wrapper.vm.$nextTick(() => {
    wrapper
    .find('.insane__publication').trigger('click');
    expect(feed.actions.setFilter)
    .toBeCalledWith(expect.anything(), {
      type: 'publication',
      info: expectedPublication,
    }, undefined);
    done();
  });
});

it('should commit "setDndModeTime" when "For 1 Hour" or "Until Tomorrow" is clicked', () => {
  const wrapper = mount(DaHome, { store, localVue });
  wrapper.find('.dnd-context .btn-menu').trigger('click');
  expect(ui.mutations.setDndModeTime).toBeCalledWith(expect.anything(), expect.any(Number));
});
