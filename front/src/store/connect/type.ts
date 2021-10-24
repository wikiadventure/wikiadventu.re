import { Lang } from "src/i18n";
import { GameLoopType } from "store/lobby/game/loop/type";
import { GamePhaseType } from "store/lobby/game/phase/type";
import { LobbyType } from "store/lobby/type";

export enum ConnectType {
    PublicJoin,
    PrivateCreate ,
    PrivateJoin,
    TwitchCreate,
    TwitchJoinWith,
    TwitchJoinWithout,

}

export interface ConnectEvent {
    type:ConnectType,
    password?:string,
}

export interface loginQuery {
    type: ConnectType;
    lang:Lang;
    pseudo:string;
    password?:string;
    lobby?:string;
    slot?:number;
    gameLoop?:number;
    config?:any;
    code?:string;
}

export interface ConnectResponse {
    lobbyID:string,
    lobbyType:LobbyType,
    slot:number,
    gameLoop:number,
    playerID:string,
    lang:Lang
}

export type Sucess<T extends InfoStatus | unknown> = T extends InfoStatus.Found ? Info : unknown; 

export interface Info {
    lobbyID:string,
    lobbyType:LobbyType,
    lobbyLang:Lang,
    gameLoop:GameLoopType,
    gamePhase:GamePhaseType,
    slot:number,
    players:number,
}

export type InfoResponse<T extends InfoStatus | unknown> = Sucess<T> & {
    status:InfoStatus,
    error?:String
}

export function isSucess(i:InfoResponse<unknown>):i is InfoResponse<InfoStatus.Found> {
    return i.status == InfoStatus.Found;
}

export enum InfoStatus {
  Found = "Found",
  NotFound = "NotFound",
  ServerError = "ServerError"
}

export enum ErrorCode {
    noInternet = 0,
    invalidMethod = 100, //client error
    invalidForm,
    invalidID,
    invalidLobbyType,
    noLobbyFoundWithID,
    noLobbyFoundWithChannelName,
    lobbyFull,
    invalidPassword,
    invalidGameLoop,
    invalidTwitchCode,
    lobbyLimitReached = 200, //server error
    privateLobbyLimitReached,
    twitchConnectionError
}
