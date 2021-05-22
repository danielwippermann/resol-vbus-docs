import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/views/Home.vue';
import Jsdoc from '@/views/Jsdoc.vue';
import Md from '@/views/Md.vue';
import Vsf from '@/views/Vsf.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/md/*',
    component: Md,
  },
  {
    path: '/jsdoc',
    component: Jsdoc,
  },
  {
    path: '/jsdoc/*',
    component: Jsdoc,
  },
  {
    path: '/vsf',
    component: Vsf,
  },
  {
    path: '/vsf/:kind/:id',
    component: Vsf,
    props: true,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
