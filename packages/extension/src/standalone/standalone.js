import Vue from 'vue';
import VueRouter from 'vue-router';
import svgicon from 'vue-svgicon';
import VueMasonry from 'vue-masonry-css';
import { applyTheme } from '@daily/services';
import App from './App.vue';
import Home from '../routes/Home.vue';
import store from '../store';
import { getCache, STATE_KEY } from '../common/cache';

Vue.use(svgicon);
Vue.use(VueMasonry);
Vue.use(VueRouter);

const router = new VueRouter({
  base: '/index.html',
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    // { path: '/', redirect: '/onboarding' },
    { path: '/login', component: () => import('../routes/Login.vue'), props: route => ({ ...route.query }) },
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

router.beforeEach((to, from, next) => Promise.resolve()
  .then(async () => {
    if (!store.state.initialized) {
      const state = await getCache(STATE_KEY, {});
      store.commit('loadFromCache', state);
      // TODO: find a better place apply theme after cache
      if (state.ui && state.ui.theme) {
        applyTheme(window.document, state.ui.theme, null);
      }
    }
  })
  .then(next));

router.beforeEach((to, from, next) => {
  if (to.path === '/' && to.query.provider && to.query.code) {
    next({ path: '/login', query: to.query });
  } else if (to.path === '/' && !store.state.ui.onboarding) {
    next({ path: '/onboarding' });
  } else {
    next();
  }
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
