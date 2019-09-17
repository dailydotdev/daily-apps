import Vue from 'vue';
import VueRouter from 'vue-router';
import svgicon from 'vue-svgicon';
import VTooltip from 'v-tooltip';
import App from './App.vue';
import store from '../store';
import { getCache, STATE_KEY } from '../common/cache';
import { debug } from '../common/config';
import { browserName } from '../common/browser';

const loadFromCache = async () => {
  const state = await getCache(STATE_KEY, {});

  if (!store.state.initialized) {
    store.commit('loadFromCache', state);
  }

  const source = window.location.href.split('source=')[1];
  const isDnd = state.ui && new Date().getTime() <= state.ui.dndModeTime;
  if (!source && isDnd) {
    const tab = await browser.tabs.getCurrent();
    const url = browserName === 'chrome'
      ? 'chrome-search://local-ntp/local-ntp.html'
      : 'https://www.google.com';

    browser.tabs.update(tab.id, { url });
    window.stop();
    return;
  }

  document.documentElement.classList.add('loaded');

  if (state.ui.dndModeTime && !isDnd) {
    store.commit('ui/disableDndMode');
  }
};

// TODO: handle error
// eslint-disable-next-line no-console
const bootPromise = loadFromCache().catch(console.error);

Vue.use(svgicon);
Vue.use(VTooltip, { defaultDelay: { show: 400, hide: 0 } });
Vue.use(VueRouter);

const router = new VueRouter({
  base: '/index.html',
  mode: 'history',
  routes: [
    { path: '/', component: () => import(/* webpackChunkName: "home" */ '../routes/Home.vue') },
    // { path: '/', redirect: '/onboarding' },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../routes/Login.vue'),
      props: route => ({ ...route.query }),
    },
    {
      path: '/onboarding',
      redirect: '/onboarding/1',
      component: () => import(/* webpackChunkName: "onboarding" */ '../routes/Onboarding.vue'),
      children: [
        {
          path: '1',
          component: () => import(/* webpackChunkName: "onboarding" */ '../routes/Step1.vue'),
        },
        {
          path: '2',
          component: () => import(/* webpackChunkName: "onboarding" */ '../routes/Step2.vue'),
        },
        {
          path: '3',
          component: () => import(/* webpackChunkName: "onboarding" */ '../routes/Step3.vue'),
        },
      ],
    },
  ],
});

// Redirect to login or onboarding if necessary
router.beforeEach(async (to, from, next) => {
  await bootPromise;

  if (to.path === '/' && to.query.provider && to.query.code) {
    next({ path: '/login', query: to.query });
  } else if (to.path === '/' && !store.state.ui.onboarding && !debug) {
    next({ path: '/onboarding' });
  } else {
    next();
  }
});

// Workaround to clear url after routing
router.afterEach(() => {
  setTimeout(() => {
    window.history.replaceState({}, document.title, '/index.html');
  });
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});

// TODO: add tests
Vue.filter('terminalTime', value => value.toLocaleString('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}));

Vue.filter('provider', (value) => {
  if (value === 'github') {
    return 'GitHub';
  }

  return value.replace(/^\w/, c => c.toUpperCase());
});

window.onbeforeunload = () => {
  window.scrollTo(0, 0);
};
