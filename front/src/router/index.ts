import { route } from 'quasar/wrappers';
import VueRouter from 'vue-router';
import { Store } from "vuex";
import { StateInterface } from 'src/store';
import routes from './routes';
import { Notify } from 'quasar'
import { Dark } from 'quasar';


/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export const Router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,

  // Leave these as is and change from quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
});

export default route<Store<StateInterface>>(function ({ Vue }) {
  Vue.use(VueRouter);
  Dark.set(true);
  Notify.registerType('annonce', {
    icon: 'announcement',
    progress: true,
    color: 'teal',
    textColor: 'white',
    actions: [{ icon: 'close', color: 'white' }]
  })

  return Router;
})
