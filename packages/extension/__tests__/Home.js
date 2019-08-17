import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import svgicon from 'vue-svgicon';
import DaHome from '../src/routes/Home.vue';
import DaCardPost from '../../components/src/components/DaCardPost.vue';
import DaContext from '../../components/src/components/DaContext.vue';
import DaCardPlaceholder from '../../components/src/components/DaCardPlaceholder.vue';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(svgicon);
localVue.component('da-card-post', DaCardPost);
localVue.component('da-context', DaContext);
localVue.component('da-card-placeholder', DaCardPlaceholder);

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
    getters: {
    topSitesInstructions: jest.fn(),
    sidebarInstructions: jest.fn(),
    showReadyModal: jest.fn()
    }
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
