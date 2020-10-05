import Vue from 'vue';
import Router from 'vue-router';
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
  ],
});

export default router;
