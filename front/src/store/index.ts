import { store } from 'quasar/wrappers';
import Vue from 'vue';
import Vuex from 'vuex';

import globalForm from './globalForm'
import gameData from './gameData'
import { GlobalForm } from './globalForm/state';
import { GameData } from './gameData/state';
// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  globalForm: GlobalForm,
  gameData: GameData
  // Define your own store structure, using submodules if needed
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
}

Vue.use(Vuex);
const Store = new Vuex.Store<StateInterface>({
  modules: {
    globalForm,
    gameData
  },
  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: false
});

export default store(function ({ Vue }) {
  return Store;
});

export  { Store };
