import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GameData, GameState, LobbyEvent, LobbyEventType, LobbyType, PlayerJoin, PlayerLeft, UpdateScore, VoteResult, WinRound, WsMessage } from './state';

const actions: ActionTree<GameData, StateInterface> = {
  connect({ commit, state }) {
    
    console.log("try to connect");
    var loc = window.location;
    var protocol = loc.protocol == "https:" ? "wss://" : "ws://";
    var lobbyType = state.lobbyType == LobbyType.Twitch ? "twitch" : "lobby"
    var wsURL = protocol + loc.host + "/" + lobbyType + "/" + state.lobbyID + "/" + state.uuid;
    state.ws  = new WebSocket(wsURL);
    function onMessage(data:WsMessage) {
      console.log("message received");
      commit('pushMessage', data);
    };
    function onGameState(data:GameState) {
      commit('gameState', data);
    };
    function onVoteResult(data:VoteResult) {
      commit('voteResult', data);
    };
    function onUpdateScore(data:UpdateScore) {
      commit('updateScore', data);
    };
    function onWinRound(data:WinRound) {
      //store.commit('gameData/pushMessage', data);
    };
    function onPlayerJoin(data:PlayerJoin) {
      commit('playerJoin', data);
    };
    function onPlayerLeft(data:PlayerLeft) {
      commit('playerLeft', data);
    };
    function dataHandler(e:MessageEvent) {
      console.log(e);
      var json:LobbyEvent<any> = JSON.parse(e.data);
      switch (json.type) {
        case LobbyEventType.Message: { 
          return onMessage(json.data);
        };
        case LobbyEventType.GameState: { 
          return onGameState(json.data);
        };
        case LobbyEventType.VoteResult: { 
          return onVoteResult(json.data);
        };
        case LobbyEventType.UpdateScore: { 
          return onUpdateScore(json.data);
        };
        case LobbyEventType.WinRound: { 
          return onWinRound(json.data);
        };
        case LobbyEventType.PlayerJoin: { 
          return onPlayerJoin(json.data);
        };
        case LobbyEventType.PlayerLeft: { 
          return onPlayerLeft(json.data);
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
      console.log("connected");
      console.log(e);
    };
    state.ws.onmessage = dataHandler;
    state.ws.onclose = closeHandler;
    state.ws.onerror = errorHandler;
    state.ws.onopen = onOpen;
  },
  sendMessage({ commit, state }, data) {
    console.log("sendMessage");
    var json:WebsocketPackage = {
      type: WebsocketPackageType.Message,
      value: data
    };
    state.ws?.send(JSON.stringify(json));
  }
};

interface WebsocketPackage {
  type:WebsocketPackageType,
  value:String
}
enum WebsocketPackageType {
  Message = "Message",
  Vote = "Vote",
  Validate = "Validate"
}

export default actions;
