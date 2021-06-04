import { Lang } from 'src/i18n';
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
        function onMessage(e:MessageEvent) {
            if (e.origin == window.origin) {
                query.code = e.data.code;
                window.removeEventListener("message",onMessage);
                options.body = JSON.stringify(query);
                connect(options, true);
            }
        }
        window.addEventListener("message",onMessage);
        var twitch = window.open("https://id.twitch.tv/oauth2/authorize?response_type=code&client_id="+process.env.TWITCH_CLIENT_ID+"&redirect_uri="+encodeURIComponent(window.location.origin+"/api/twitch")+"&scope=chat%3Aread+chat%3Aedit");
    } else {
        options.body = JSON.stringify(query);
        connect(options, event.type == ConnectType.TwitchJoinWithout);
    }
}

export async function connect(options:RequestInit, twitch?:boolean) {
    return fetch("/api/"+ (twitch ? "twitch" : "connect"), options)
        .then(async r => {return { json: await r.json(), res: r}})
        .then(r => {
            Store.state.globalForm.connecting = false;
            if (!r.res.ok) return error(r.json.code);
            start(r.json);
        })
        .catch(function(e) {
            Store.state.globalForm.connecting = false;
            error(ErrorCode.NoInternet, e);
    });
}

export async function error(n:number, message?:string) {
  Notify.create({
    type: 'negative',
    position: 'top',
    message: i18n.t(translate(n)) + (message ? (' : ' + message) : "")
  });
}

export async function start(json:ConnectionResponse) {
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
    code?:string;
}

export interface ConnectionResponse {
    lobbyID:string,
    lobbyType:LobbyType,
    slot:number,
    gameMode:number,
    playerID:string,
    lang:Lang
}
export function translate(e:ErrorCode):string {
    return "connectError." + (Object.keys(ErrorCode).find(k => ErrorCode[k] === e) || "UnknowError" );
}

export enum ErrorCode {
    NoInternet = 0,
    InvalidMethod = 100, //client error
    InvalidForm,
    InvalidID,
    InvalidLobbyType,
    NoLobbyFoundWithID,
    NoLobbyFoundWithChannelName,
    LobbyFull,
    InvalidPassword,
    InvalidGameLoop,
    InvalidTwitchCode,
    LobbyLimitReached = 200, //server error
    PrivateLobbyLimitReached,
    TwitchConnectionError
}

