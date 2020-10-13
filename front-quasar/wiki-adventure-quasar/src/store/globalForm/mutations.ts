import { MutationTree } from 'vuex';
import { GlobalForm, Lang } from './state';
import { getRandomPseudo } from './randomPseudo/generator';

const mutation: MutationTree<GlobalForm> = {
  setLang(state:GlobalForm, l:Lang) {
    state.lang = l;
  },
  setPseudo(state:GlobalForm, p:string) {
    state.pseudo = p;
  },
  randomizePseudo(state:GlobalForm) {
    state.pseudo = getRandomPseudo(state.lang);
  }
};

export default mutation;
