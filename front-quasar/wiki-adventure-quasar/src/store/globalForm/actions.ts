import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GlobalForm } from './state';

const actions: ActionTree<GlobalForm, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default actions;
