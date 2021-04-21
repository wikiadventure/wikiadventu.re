import { MutationTree } from 'vuex';
import { GlobalForm } from './state';
import { getRandomPseudo } from './randomPseudo/generator';
import { Lang } from 'src/i18n';
import { Quasar } from 'quasar';

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
  setGameLoop(state:GlobalForm, g:number) {
    state.gameLoop = Number(g);
  },
  setSlot(state:GlobalForm, s:number) {
    var s = Number(s);
    if (s < 2) state.slot = 2;
    else if (s > 50) state.slot = 50;
    else state.slot = s;
  },
  setConnecting(state:GlobalForm, b:boolean) {
    state.connecting = b;
  },
  randomizePseudo(state:GlobalForm) {
    state.pseudo = getRandomPseudo(state.lang);
  },
  defaultLang(state:GlobalForm) {
    var localLang = Quasar.lang.getLocale() as string;
    var computedLocalLang = localLang.split("-")[0] as Lang;
    if (!Object.values(Lang).includes(computedLocalLang)) computedLocalLang = Lang.en;
    state.lang = computedLocalLang;
  }
};

export default mutation;
