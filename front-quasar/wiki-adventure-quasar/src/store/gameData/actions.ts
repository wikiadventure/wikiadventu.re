import { Lang } from 'src/i18n';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GameData, GameState, LobbyEvent, LobbyEventType, LobbyState, LobbyType, Path, PlayerJoin, PlayerLeft, SetOwner, UpdateScore, VoteResult, WinRound, WsMessage } from './state';

const actions: ActionTree<GameData, StateInterface> = {
  connect({ commit, dispatch, state }) {
    
    console.log("try to connect");
    var loc = window.location;
    var protocol = loc.protocol == "https:" ? "wss://" : "ws://";
    var lobbyType = state.lobbyType == LobbyType.Twitch ? "twitchLobby" : "lobby"
    var wsURL = protocol + loc.host + "/" + lobbyType + "/" + state.lobbyID + "/" + state.uuid;
    state.ws  = new WebSocket(wsURL);
    function dataHandler(e:MessageEvent) {
      console.log(e);
      var json:LobbyEvent<any> = JSON.parse(e.data);
      switch (json.type) {
        case LobbyEventType.Message: {
          return dispatch('onMessage', json.data);
        };
        case LobbyEventType.GameState: {
          return dispatch('onGameState', json.data);
        };
        case LobbyEventType.VoteResult: {
          return dispatch('onVoteResult', json.data);
        };
        case LobbyEventType.UpdateScore: {
          return dispatch('onUpdateScore', json.data);
        };
        case LobbyEventType.WinRound: {
          return dispatch('onWinRound', json.data);
        };
        case LobbyEventType.PlayerJoin: {
          return dispatch('onPlayerJoin', json.data);
        };
        case LobbyEventType.PlayerLeft: {
          return dispatch('onPlayerLeft', json.data);
        };
        case LobbyEventType.SetOwner: {
          return dispatch('onSetOwner', json.data);
        };
        case LobbyEventType.Path: {
          return dispatch('onPath', json.data);
        };
        default: {
          return;
        }
      }
    };
    function closeHandler(e:CloseEvent) {
      console.log(e.code, e.reason);
    };
    function errorHandler(e:Event) {
      console.log(e);
    };
    function onOpen(e:Event) {
      console.log(e);
    };
    state.ws.onmessage = dataHandler;
    state.ws.onclose = closeHandler;
    state.ws.onerror = errorHandler;
    state.ws.onopen = onOpen;
  },
  onMessage({ commit }, data:WsMessage) {
    commit('pushMessage', data);
  },
  onGameState({ commit }, data:GameState) {
    commit('gameState', data);
  },
  onVoteResult({ commit }, data:VoteResult) {
    commit('voteResult', data);
  },
  onUpdateScore({ commit }, data:UpdateScore) {
    commit('updateScore', data);
  },
  onWinRound({ commit }, data:WinRound) {
    commit('winRound', data);
  },
  onPlayerJoin({ commit }, data:PlayerJoin) {
    commit('playerJoin', data);
  },
  onPlayerLeft({ commit }, data:PlayerLeft) {
    commit('playerLeft', data);
  },
  onSetOwner({ commit }, data:SetOwner) {
    commit('setOwner', data.id);
  },
  onPath({ commit }, data:Path) {
    console.log("action : received !");
    commit('path', data.pages);
  },
  sendStart({ state }) {
    var json:WebsocketPackage = {
      type: WebsocketPackageType.Start,
    };
    state.ws?.send(JSON.stringify(json));
  },
  sendMessage({ state }, data) {
    var json:WebsocketPackage = {
      type: WebsocketPackageType.Message,
      value: data
    };
    state.ws?.send(JSON.stringify(json));
  },
  sendVote({ state }, data) {
    var json:WebsocketPackage = {
      type: WebsocketPackageType.Vote,
      value: data
    };
    state.ws?.send(JSON.stringify(json));
  },
  resetVote({ state }) {
    var json:WebsocketPackage = {
      type: WebsocketPackageType.ResetVote
    };
    state.ws?.send(JSON.stringify(json));
  },
  validateJump({ state }, data) {
    var json:WebsocketPackage = {
      type: WebsocketPackageType.Validate,
      value: data
    };
    state.ws?.send(JSON.stringify(json));
  },
  reset({ state }) {
    if (state.ws != null) state.ws.close(1001);
    state.ws = undefined;
    state.uuid = "";
    state.lang = Lang.en;
    state.lobbyType = LobbyType.Public;
    state.lobbyID = "";
    state.lobbyState = LobbyState.Voting;
    state.stateCounter = undefined;
    state.round = 0;
    state.timeLeft = 0;
    state.timeStamp = 0;
    state.startPage = "";
    state.endPage = "";
    state.players = [];
    state.messages = [];
    state.winnerPageHistory = [];
    state.self = -1;
    state.owner = -2;
    state.winnerId = -3;
  }
};

interface WebsocketPackage {
  type:WebsocketPackageType,
  value?:String
}
enum WebsocketPackageType {
  Start = "Start",
  Message = "Message",
  Vote = "Vote",
  ResetVote = "ResetVote",
  Validate = "Validate"
}

export default actions;
