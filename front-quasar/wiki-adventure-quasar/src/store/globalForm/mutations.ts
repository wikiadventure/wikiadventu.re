import { MutationTree } from 'vuex';
import { GlobalForm } from './state';
import { getRandomPseudo } from './randomPseudo/generator';
import { Lang } from 'src/i18n';

const mutation: MutationTree<GlobalForm> = {
  setLang(state:GlobalForm, l:Lang) {
    state.lang = l;
  },
  setPseudo(state:GlobalForm, p:string) {
    state.pseudo = p;
  },
  setLobbyID(state:GlobalForm, id:string) {
    state.lobbyID = id;
  },
  randomizePseudo(state:GlobalForm) {
    state.pseudo = getRandomPseudo(state.lang);
  }
};

export default mutation;
