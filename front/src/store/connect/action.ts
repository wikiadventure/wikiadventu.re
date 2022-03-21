import { Notify } from 'quasar';
import { uuid as playerUuid } from "store/player/state";
import { gameLoop as lobbyGameLoop, id as lobbyId, lang as lobbyLang, slot as lobbySlot, type } from 'store/lobby/state';
import { connecting, gameLoop, id, lang, pseudo, slot } from './state';
import { LobbyType } from 'store/lobby/type';
import { ConnectEvent, ConnectResponse, ConnectType, ErrorCode, loginQuery } from './type';
import { i18n } from 'src/boot/i18n';
import { Router } from 'src/router';
import { randomizePseudo } from './randomPseudo/generator';
import { TWITCH_CLIENT_ID, twitchName } from './twitch/state';
import { setConfig } from './extra/state';
import { apiRoot } from 'store/utils/ApiRoot';

const WithId = [ConnectType.PrivateJoin, ConnectType.PublicJoin];
const IdOptionnal = [ConnectType.PublicJoin];
const Create = [ConnectType.PrivateCreate, ConnectType.TwitchCreate];
const ChooseGameLoop = [ConnectType.PrivateCreate, ConnectType.TwitchCreate, ConnectType.PublicJoin];
const NoPassword = [ConnectType.PublicJoin];
const WithTwitch = [ConnectType.TwitchCreate, ConnectType.TwitchJoinWith];
const twicthJoin = [ConnectType.TwitchJoinWith, ConnectType.TwitchJoinWithout];

export function login(event:ConnectEvent) {
    if(connecting.value) return;
    validatePseudo();
    connecting.value = true;
    var query:loginQuery = {
        type: event.type,
        lang: lang.value,
        pseudo: pseudo.value
    }
    var options:RequestInit = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    if (WithId.includes(event.type)) {
      if (id.value != "") {
            query.lobby = id.value;
      } else if (!IdOptionnal.includes(event.type)) {
        Notify.create({
            type: 'negative',
            position: 'top',
            message: i18n.global.t('lobbyIDRequired') as string
        });
        connecting.value = false;
        return;
      }
    }
    if (twicthJoin.includes(event.type)) {
        query.lobby = twitchName.value;
    }

    if (Create.includes(event.type)) {
        query.slot = slot.value;
        query.config = setConfig();
    }

    if (ChooseGameLoop.includes(event.type)) query.gameLoop = gameLoop.value;

    if (!NoPassword.includes(event.type)) query.password = event.password;

    if (WithTwitch.includes(event.type)) {
        var hasReceived = false;
        function onMessage(e:MessageEvent) {
            if (e.origin == window.origin) {
                hasReceived = true;
                query.code = e.data.code;
                window.removeEventListener("message",onMessage);
                options.body = JSON.stringify(query);
                connect(options, true);
            }
        }
        window.addEventListener("message",onMessage);
        var twitch = window.open(`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin+"/api/twitch")}&scope=chat%3Aread+chat%3Aedit`);
        if (twitch) {
            var timer = setInterval(() => { 
                if(twitch?.closed) {
                    clearInterval(timer);
                    if (!hasReceived) {
                        connecting.value = false;
                        //TODO: Notify twitch auth user closed twitch auth
                    }
                }
            }, 1000);
        }
    } else {
        options.body = JSON.stringify(query);
        connect(options, event.type == ConnectType.TwitchJoinWithout);
    }
}

export async function connect(options:RequestInit, twitch?:boolean) {
    console.log(options);
    return fetch(apiRoot+"/api/"+ (twitch ? "twitch" : "connect"), options)
        .then(async r => {return { json: await r.json(), res: r}})
        .then(r => {
            if (!r.res.ok) {
                connecting.value = false;
                return notifyError(r.json.code);
            }
            start(r.json);
        })
        .catch(e => {
            connecting.value = false;
            notifyError(ErrorCode.noInternet, e);
    });
}

export function validatePseudo() {
    if (pseudo.value.length < 3 || pseudo.value.length > 25) randomizePseudo();
}

export async function start(json:ConnectResponse) {
    lobbyLang.value = json.lang;
    lobbyId.value = json.lobbyID;
    type.value = json.lobbyType;
    playerUuid.value = json.playerID;
    lobbySlot.value = json.slot;
    lobbyGameLoop.value = json.gameLoop;
    connecting.value=false;
    Router.push('/'+(json.lobbyType == LobbyType.Twitch ? "twitch" : "play")+'/'+json.lobbyID);
}

export async function notifyError(n:number, message?:string) {
    Notify.create({
      type: 'negative',
      position: 'top',
      message: i18n.global.t(translate(n)) + (message ? (' : ' + message) : "")
    });
}

export function translate(e:ErrorCode):string {
    // @ts-expect-error: Can't access error Code with k of type string, it should be number
    return "connectError." + (Object.keys(ErrorCode).find(k => ErrorCode[k] === e) || "unknowError" );
}
