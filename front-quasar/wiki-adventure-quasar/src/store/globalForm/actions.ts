import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GlobalForm } from './state';

const actions: ActionTree<GlobalForm, StateInterface> = {
  validatePseudo({ commit, state }) {
    if (state.pseudo.length <= 3 || state.pseudo.length >= 25 || state.pseudo.match(/[<>:|%$\/\\]/g) ) {
        commit("randomizePseudo");
    }
  }
};

export default actions;
