import { store } from 'quasar/wrappers';
import { MutationTree } from 'vuex';
import { Lang } from '../globalForm/state';
import { GameData, GameState, LobbyType, Message, Player, PlayerJoin, PlayerLeft, UpdateScore, VoteResult, WsMessage } from './state';

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
  pushMessage(state:GameData, m:WsMessage) {
    console.log("push message");
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
    }
    if (p.self) state.selfPlayerID = p.id;
    state.players.push(player);
  },
  playerLeft(state:GameData, p:PlayerLeft) {
    for(var i=0;i<state.players.length; ++i) {
      if (state.players[i].id == p.id) {
        state.players.splice(i);
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
    var timeStamp = Date.now();
    var stateCounter = setInterval(function() {
      var time = Date.now();
      var dt = time - timeStamp;
      timeStamp = time;
      state.timeLeft = state.timeLeft - dt*0.001;
      if (state.timeLeft <= 0) {
        clearInterval(stateCounter);
        state.timeLeft = 0;
      }
  }, 100);
  }
  
};

export default mutation;
