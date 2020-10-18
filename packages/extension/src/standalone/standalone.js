import Vue from 'vue';
import VueRouter from 'vue-router';
import VueApollo from 'vue-apollo';
import { VTooltip } from 'v-tooltip';
import icons from '@daily/components/src/icons';
import mdyDateFilter from '@daily/components/src/common/mdyDateFilter';
import App from './App.vue';
import store from '../store';
import { getCache, STATE_KEY } from '../common/cache';
import { browserName } from '../common/browser';
import { apolloClient, persistor } from '../apollo';

Vue.use(VueApollo);
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $query: {
      notifyOnNetworkStatusChange: false,
    },
  },
});

const loadFromCache = async () => {
  const state = await getCache(STATE_KEY, {});
  const apolloCacheLoad = persistor.restore();

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
  await apolloCacheLoad;
};

// TODO: handle error
// eslint-disable-next-line no-console
const bootPromise = loadFromCache().catch(console.error);

Vue.use(VueRouter);
Vue.use(icons);
Vue.directive('tooltip', VTooltip);
Vue.filter('mdyDate', mdyDateFilter);

const router = new VueRouter({
  base: '/index.html',
  mode: 'history',
  routes: [
    { path: '/', component: () => import(/* webpackChunkName: "home" */ '../routes/Home.vue') },
  ],
});

// Redirect to login if necessary
router.beforeEach(async (to, from, next) => {
  await bootPromise;

  if (to.path === '/' && to.query.provider && to.query.code) {
    next({ path: '/login', query: to.query });
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
  apolloProvider,
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
