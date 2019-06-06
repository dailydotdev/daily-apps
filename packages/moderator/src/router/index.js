import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import { getCache, STATE_KEY } from '../common/cache';
import Home from '../views/Home.vue';
import Requests from '../views/Requests.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      props: route => ({ showApprovals: route.name === 'approvals' }),
      children: [{
        path: '',
        name: 'requests',
        component: Requests,
      }, {
        path: 'approvals',
        name: 'approvals',
        component: () => import(/* webpackChunkName: "approvals" */ '../views/Approvals.vue'),
      }],
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    },
    {
      path: '/oauth/:provider/callback',
      name: 'oauth',
      component: () => import(/* webpackChunkName: "oauth" */ '../views/OAuth.vue'),
    },
  ],
});

// Load local cache
router.beforeEach((to, from, next) => Promise.resolve()
  .then(async () => {
    if (!store.state.initialized) {
      const state = await getCache(STATE_KEY, {});
      store.commit('loadFromCache', state);
    }
  })
  .then(next));

export default router;
