import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { GameData } from './state';

const getters: GetterTree<GameData, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default getters;
