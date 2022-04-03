import type { FastifyRequest, FastifyReply } from "fastify";
import { Lobby } from "src/game/lobby/class";
import { Player } from "src/game/lobby/player/class";
import { ConnectError, connectErrorReply } from "src/reply/ConnectError";
import { ConnectRequest, connectResponse } from ".";

export function PublicJoin(req: FastifyRequest, rep: FastifyReply, form:ConnectRequest) {
    try {
        if (form.lobby != null && form.lobby != "") {
           var lobby = Lobby.find(form.lobby);
        } else var lobby = Lobby.joinPublicFree(form.lang, form.gameLoop);
        const { addPlayer } = lobby.connect();
        const player = new Player(form.pseudo);
        addPlayer(player);
        return connectResponse(lobby, player);
    } catch (e) {
        connectErrorReply(e as ConnectError, rep);
        return 
    }
}