import type { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import type { Lobby } from "src/game/lobby/class";
import type { GameLoopType } from "src/game/lobby/gameLoop/types";
import type { Player } from "src/game/lobby/player/class";
import type { LobbyType } from "src/game/lobby/types";
import type { Lang } from "src/lang";

const options:RouteShorthandOptions = {
    schema: {

    }
}

export function connect(req: FastifyRequest, rep: FastifyReply) {

    
    switch ((req.body as ConnectRequest).type) {
        case PublicJoin: new PublicJoinController(im, sr, body, form);
        case PrivateCreate: new PrivateCreateController(im, sr, body, form);
        case PrivateJoin: new PrivateJoinController(im, sr, body, form);
        default: new ConnectionError(im, sr, InvalidLobbyType);
    }

}

export function connectResponse(lobby:Lobby, player:Player):ConnectResponse {
    return {
        lobbyID: lobby.formatId,
        lobbyType: lobby.type,
        gameLoop: lobby.gameLoop.type,
        slot: lobby.slot,
        lang: lobby.lang,
        playerID: player.uuid
    }
}

export type ConnectResponse = {
    lobbyID:string,
    lobbyType:LobbyType,
    gameLoop:number,
    slot:number,
    lang:Lang,
    playerID:string
}

export type ConnectRequest = {
    type:LoginType,
    lang:Lang,
    pseudo:string,
    slot?:number,
    gameLoop?:GameLoopType,
    password?:string,
    lobby?:string,
    config:any
}

import type { FastifyReply } from 'fastify';

export function connectErrorReply(code:ConnectError, rep: FastifyReply) {
    rep.type("application/json");
    rep.code(400);
    rep.send({code})
}

export enum ConnectError {
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
    InvalidPseudo,
    TwitchIdAlreadyUsed,
    LobbyLimitReached = 200, //server error
    PrivateLobbyLimitReached,
	TwitchConnectionError,
}
