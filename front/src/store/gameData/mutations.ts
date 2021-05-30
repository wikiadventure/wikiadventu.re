import counter from './script/countdown';
import { Lang } from 'src/i18n';
import { MutationTree } from 'vuex';
import { GameData, LobbyType, Message, Player, WikiRawSuggestion } from './state';
import { GameState, Path, PlayerJoin, PlayerLeft, UpdateScore, VoteResult, VoteSkip, WinRound, WsMessage } from './actions';
import { loadPreviews, loadSuggestions, wikiHeaders } from 'src/mixins/wiki/wikiTools';

const mutation: MutationTree<GameData> = {
  setLang(state:GameData, l:Lang) {
    state.lang = l;
  },
  setUuid(state:GameData, uuid:string) {
    state.uuid = uuid;
  },
  setLobbyID(state:GameData, id:string) {
    state.lobbyID = id;
  },
  setLobbyType(state:GameData, type:LobbyType) {
    state.lobbyType = type;
  },
  setSlot(state:GameData, s:number) {
    state.slot = s;
  },
  setGameLoop(state:GameData, type:number) {
    state.gameLoop = type;
  },
  path(state:GameData, data:Path) {
    state.winnerPageHistory = data.pages;
    state.winnerTime = data.time;
  },
  voteSkip(state:GameData, p:VoteSkip) {
    for(var player of state.players) {
      if (player.id == p.id) {
        player.voteSkip = p.state;
        return;
      }
    }
  },
  setOwner(state:GameData, o:number) {
    state.owner = o;
  },
  pushMessage(state:GameData, m:WsMessage) {
    var message:Message = {
      playerID: m.id,
      content: m.mes,
      timeStamp: Date.now()  
    }
    state.messages.push(message);
  },
  playerJoin(state:GameData, p:PlayerJoin) {
    var player:Player = {
      pseudo: p.pseudo,
      id: p.id,
      score: p.score,
      winStreak: 0,
      voteSkip: p.voteSkip,
      isConnected: true
    }
    if (p.self) state.self = p.id;
    state.players.push(player);
  },
  playerLeft(state:GameData, p:PlayerLeft) {
    state.players.find(s => s.id == p.id).isConnected = false;
  },
  async voteResult(state:GameData, v:VoteResult) {
    state.startPage.title = v.start;
    state.endPage.title = v.end;
    var previews = await loadPreviews([v.start, v.end], state.lang);
    state.startPage = previews.find((w) => w.title == v.start);
    state.endPage = previews.find((w) => w.title == v.end);
    
  },
  updateScore(state:GameData, p:UpdateScore) {
    for(var player of state.players) {
      if (player.id == p.id) {
        player.score = p.score;
        return;
      }
    }
  },
  gameState(state:GameData, g:GameState) {
    if (g.round == 1) state.players = state.players.filter(p => p.isConnected);
    state.players.forEach(p => p.voteSkip = false);
    state.gamePhase = g.phase;
    state.round = g.round;
    state.timeController.abort();
    state.timeController = new AbortController();
    state.timeLeft = g.time*1000;
    state.timeStamp = document.timeline ? document.timeline.currentTime : performance.now();
    counter(100, state.timeStamp, state.timeController.signal, time => {
      state.timeLeft = g.time*1000 - (time - state.timeStamp);
      if (state.timeLeft <= 0) {
        state.timeController.abort();
        state.timeController = new AbortController();
        state.timeLeft = 0;
      }
    });
  },
  deleteVote(state:GameData) {
    state.vote.label = null;
    state.vote.title = null;
    state.vote.description = null;
    state.vote.thumbnail = null;
  },
  winRound(state:GameData, w:WinRound) {
    state.winnerId = w.id;
  },
  mute(state:GameData, m:boolean) {
    state.mute = m;
  },
  volume(state:GameData, v:number) {
    state.volume = v;
  },
  safeMode(state:GameData, b:boolean) {
    state.safeMode = b;
  },
  voteInput(state:GameData, v:string) {
    state.vote.input = v;
  },
  async loadSuggestions(state:GameData) {
    state.suggestions = await loadSuggestions(state.vote.input, state.lang);
    
  }
  
};

export default mutation;
