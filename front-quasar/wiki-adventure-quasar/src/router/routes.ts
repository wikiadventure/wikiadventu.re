import { Store } from '../store'
import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('pages/Connect.vue')
  },
  {
    path: '/play/:id',
    beforeEnter: (to, from, next) => {
      var store = Store as any;
      if (store.state.gameData.uuid == "") {
        next('/connect/'+to.params.id);
      } else {
        next();
      }
    },
    component: () => {
      return import('pages/Game.vue');
    }
  },
  {
    path: '/connect/:id',
    component: () => {
      return import('pages/Connect.vue');
    }
  },
  {
    path: '/test',
    component: () => {
      return import('pages/Game.vue');
    }
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
