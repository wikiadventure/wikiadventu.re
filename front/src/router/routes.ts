import { uuid } from 'store/player/state';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/Connect.vue')
  },
  {
    path: '/play/:id',
    beforeEnter: (to, from, next) => {
      if (uuid.value == "") {
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
    path: '/twitch/:id',
    beforeEnter: (to, from, next) => {
      if (uuid.value == "") {
        next('/twitchConnect/'+to.params.id);
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
    path: '/twitchConnect/:id',
    component: () => {
      return import('pages/Connect.vue');
    }
  },
  {
    path: '/api/:data',
    redirect: "/",
    beforeEnter: (to, from, next) => {
      if (to.params.data == "twitch") {
        window.opener?.postMessage(to.query, window.location.origin);
      }
      fetch(window.location.origin+to.fullPath).then(() => window.close());
    },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
