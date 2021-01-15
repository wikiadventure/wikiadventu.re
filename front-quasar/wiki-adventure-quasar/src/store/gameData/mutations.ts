import { store } from 'quasar/wrappers';
import { Lang } from 'src/i18n';
import { MutationTree } from 'vuex';
import { GameData, GameState, LobbyType, Message, Player, PlayerJoin, PlayerLeft, UpdateScore, VoteResult, WinRound, WsMessage } from './state';

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
  path(state:GameData, a:string[]) {
    console.log("mutation : received !");
    state.winnerPageHistory = a;
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
      isConnected: true
    }
    if (p.self) state.self = p.id;
    state.players.push(player);
  },
  playerLeft(state:GameData, p:PlayerLeft) {
    for(var i=0;i<state.players.length; ++i) {
      if (state.players[i].id == p.id) {
        state.players[i].isConnected = false;
        return;
      }
    }
  },
  voteResult(state:GameData, v:VoteResult) {
    state.startPage = v.start;
    state.endPage = v.end;
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
    state.lobbyState = g.state;
    state.round = g.round;
    state.timeLeft = g.time;
    state.timeStamp = Date.now();
    state.stateCounter = setInterval(function() {
      var time = Date.now();
      var dt = time - state.timeStamp;
      state.timeStamp = time;
      state.timeLeft = state.timeLeft - dt*0.001;
      if (state.timeLeft <= 0) {
        clearInterval(state.stateCounter);
        state.timeLeft = 0;
      }
    }, 100);
  },
  winRound(state:GameData, w:WinRound) {
    state.winnerId = w.id;
  },
  mute(state:GameData, m:boolean) {
    state.mute = m;
  },
  volume(state:GameData, v:number) {
    state.volume = v;
  }
  
};

export default mutation;
