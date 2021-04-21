import { Lang } from 'src/i18n';
import { ErrorCode, translate } from 'src/i18n/translateErrorCode';
import { LobbyType } from 'src/store/gameData/state';
import { Store } from '../store';
import { Router } from '../router/index';
import { Notify } from 'quasar';
import { v4 as uuid }  from 'uuid';
import { i18n } from '../boot/i18n';

export function login(event:ConnectEvent) {
    if(Store.state.globalForm.connecting) return;
    Store.state.globalForm.connecting = true;
    Store.dispatch('globalForm/validatePseudo');
    var query:loginQuery = {
      type: event.type,
      lang: Store.state.globalForm.lang,
      pseudo: Store.state.globalForm.pseudo
    }
    var options:RequestInit = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    };
    if ([ConnectType.PrivateJoin, ConnectType.PublicJoin, ConnectType.TwitchJoinWith, ConnectType.TwitchJoinWithout].includes(event.type)) {
      if (Store.state.globalForm.lobbyID != "") {
        query.lobby = Store.state.globalForm.lobbyID;
      } else if (event.type != ConnectType.PublicJoin) {
        Notify.create({
          type: 'negative',
          position: 'top',
          message: i18n.t('lobbyIDRequired') as string
        });
        Store.state.globalForm.connecting = false;
        return;
      }
    }
    if ([ConnectType.PrivateCreate, ConnectType.TwitchCreate].includes(event.type)) {
      query.slot = Store.state.globalForm.slot;
    }
    if ([ConnectType.PrivateCreate, ConnectType.TwitchCreate, ConnectType.PublicJoin].includes(event.type)) {
      query.gameMode = Store.state.globalForm.gameLoop;
    }
    if (event.type != ConnectType.PublicJoin) {
      query.password = event.password;
    }
    if (event.type == ConnectType.TwitchJoinWith || event.type == ConnectType.TwitchCreate ) {
      query.uuid = uuid();
      var twitch = window.open("https://id.twitch.tv/oauth2/authorize?response_type=code&client_id="+process.env.TWITCH_CLIENT_ID+"&redirect_uri="+encodeURIComponent(process.env.TWITCH_REDIRECT_URL)+"&state=" + query.uuid + "&scope=chat%3Aread+chat%3Aedit");
      var loop = setInterval(function() { if (twitch && twitch.closed) {
        clearInterval(loop);
        /* connect to the server send the login query
        and the uid to prove that you are auth
        and retrieve an uuid to connect to the ws lobby*/
        options.body = JSON.stringify(query);
        connect(options, true);
      }}, 50);// the duration in ms between each call of loop
    } else {
      options.body = JSON.stringify(query);
      connect(options, event.type == ConnectType.TwitchJoinWithout);
    }
}

export async function connect(options:RequestInit, twitch?:boolean) {
   return fetch("/api/"+ (twitch ? "twitch" : "connect"), options)
      .then(function(response:Response):Promise<ConnectionResponse> {
        return response.json();
      }).then(function(json:ConnectionResponse) {
        start(json);
      }).catch(function(error) {
        Store.state.globalForm.connecting = false;
        Notify.create({
          type: 'negative',
          position: 'top',
          message: i18n.t('fetchError') + ' : ' + error.message
        });
        console.log(i18n.t('fetchError') + ' : ' + error.message);
    });
}

export async function start(json:ConnectionResponse) {
    Store.state.globalForm.connecting = false;
    if (json.status == ConnectionStatus.Error) {
      Notify.create({
        type: 'negative',
        position: 'top',
        message: i18n.t(translate(json.errorCode)) as string
      });
      return;
    }
    Store.commit('gameData/setLang', json.lang);
    Store.commit('gameData/setLobbyID', json.lobbyID);
    Store.commit('gameData/setLobbyType', json.lobbyType);
    Store.commit('gameData/setUuid', json.playerID);
    Store.commit('gameData/setSlot', json.slot);
    Store.commit('gameData/setGameLoop', json.gameMode);
    Router.push('/'+(json.lobbyType == LobbyType.Twitch ? "twitch" : "play")+'/'+json.lobbyID);
}

export interface ConnectEvent {
    type:ConnectType,
    password?:string,

}

export enum ConnectType {
    PublicJoin = "PublicJoin",
    PrivateJoin = "PrivateJoin",
    PrivateCreate = "PrivateCreate",
    TwitchJoinWithout = "TwitchJoinWithout",
    TwitchJoinWith = "TwitchJoinWith",
    TwitchCreate = "TwitchCreate"
}

export interface loginQuery {
    type: string;
    lang:Lang;
    pseudo:string;
    password?:string;
    lobby?:string;
    slot?:number;
    gameMode?:number;
    uuid?:string;//for twitch
}

export interface ConnectionResponse {
    status:ConnectionStatus,
    lobbyID:string,
    lobbyType:LobbyType,
    slot:number,
    gameMode:number,
    playerID:string,
    lang:Lang,
    errorCode?:ErrorCode
}

export enum ConnectionStatus {
    Success = 'Success',
    Error = 'Error'
}
