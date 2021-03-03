import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { GameData, Player } from './state';

const getters: GetterTree<GameData, StateInterface> = {
  winner: (state) => {
    return state.players.find((p:Player) => p.id == state.winnerId);
  },
  playersByScore: (state) => {
    return state.players.sort((a:Player, b:Player) => {return b.score - a.score});
  },
  selfPlayer: (state) => {
    return state.players.find(p => p.id == state.self);
  }
  
};

export default getters;
