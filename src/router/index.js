import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import(/* webpackChunkName: "accounts" */ '../views/Accounts.vue'),
  },
  {
    path: '/operations-days',
    name: 'OperationsDays',
    component: () => import(/* webpackChunkName: "accounts" */ '../views/OperationsDays.vue'),
  },
  {
    path: '/operations',
    name: 'Operations',
    component: () => import(/* webpackChunkName: "accounts" */ '../views/Operations.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
