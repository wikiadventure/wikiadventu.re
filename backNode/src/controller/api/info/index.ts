import { Lobby } from './../../../game/lobby/class';
import type { GamePhaseType } from "@game/lobby/gameMode/gamePhase/types";
import type { GameModType } from "@game/lobby/gameMode/types";
import type { LobbyType } from "@game/lobby/types";
import type { Lang } from "@lang";
import type { FastifyReply, FastifyRequest } from "fastify";

export const getInfoUrl = '/api/info/:lobbyId';

export type GetInfoParams = {
    lobbyId: string
}

export async function Info(req: FastifyRequest, rep: FastifyReply) {
    const { lobbyId } = (req.params as GetInfoParams);
    const twitchId = lobbyId.startsWith("twitch:") ? lobbyId.substring(7) : null;
    try {
        if (twitchId!=null) {

        } else {
            const l = Lobby.find(lobbyId);
            const i:InfoSuccessReply = {
                status: InfoStatusSuccess.Found,
                lobbyID: l.formatId,
                lobbyType: l.type,
                gameMode: l.gameMode.type,
                gamePhase: l.gameMode.gamePhase.type,
                lobbyLang: l.lang,
                slot: l.slot,
                players: l.players.length
            } 
            rep.send(i);
            return;
        }
    } catch(e) {
        const i:InfoErrorReply = { status: InfoStatusError.NotFound }
        rep.code(404)
            .send(i);
    }

}

enum InfoStatusSuccess {
    Found
}

enum InfoStatusError {
    NotFound = 1
}

// type InfoStatus = InfoStatusSuccess | InfoStatusError;

type InfoSuccessReply = {
    status:InfoStatusSuccess,
    lobbyID:string,
    lobbyType:LobbyType,
    gameMode:GameModType,
    gamePhase:GamePhaseType,
    lobbyLang:Lang,
    slot:number,
    players:number,
}

type InfoErrorReply = {
    status:InfoStatusError
}