import type { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import { ConnectError, LoginType, ConnectRequest } from './type';
import { PublicJoin } from './PublicJoin';
import { PrivateJoin } from './PrivateJoin';
import type { Lobby } from "@game/lobby/class";
import type { Player } from "@game/lobby/player/class";

export const postConnectUrl = "/api/connect";

export function Connect(req: FastifyRequest, rep: FastifyReply) {
    const form = req.body as ConnectRequest;
    switch (form.type) {
        case LoginType.PrivateCreate: return PublicJoin(req, rep);
        case LoginType.PrivateJoin: return PrivateJoin(req, rep);
        case LoginType.PublicJoin: return PublicJoin(req, rep);
        default: rep.send({});// must be impossible
    }
    

}

export function connectReply(lobby: Lobby, player: Player, rep: FastifyReply) {
    rep.send({
        lobbyID: lobby.formatId,
        lobbyType: lobby.type,
        gameMode: lobby.gameMode.type,
        slot: lobby.slot,
        lang: lobby.lang,
        playerID: player.uuid
    })
}

export function connectErrorReply(code: ConnectError, rep: FastifyReply) {
    rep.code(400)
        .send({ code });
}
