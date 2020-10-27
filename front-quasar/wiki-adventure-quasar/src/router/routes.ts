import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('pages/Index.vue')
  },
  {
    path: '/connect',
    component: () => import('pages/Connect.vue')
  },
  {
    path: '/play',
    component: () => import('pages/Game.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
