import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/accounts',
    name: 'Accounts',
    component: () =>
      import(/* webpackChunkName: "accounts" */ '../views/Accounts.vue'),
  },
  {
    path: '/operating-days',
    name: 'OperatingDays',
    component: () =>
      import(/* webpackChunkName: "accounts" */ '../views/OperatingDays.vue'),
  },
  {
    path: '/operations',
    name: 'Operations',
    component: () =>
      import(/* webpackChunkName: "accounts" */ '../views/Operations.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
