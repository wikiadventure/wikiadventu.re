import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { GlobalForm, Lang } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const globalFormModule: Module<GlobalForm, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default globalFormModule;
