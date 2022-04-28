import { Lobby } from "@game/lobby/class";
import { Player } from "@game/lobby/player/class";
import type { FastifyRequest, FastifyReply } from "fastify";
import { connectErrorReply, connectReply } from ".";
import type { ConnectError, ConnectRequest } from "./type";

export function PrivateJoin(req: FastifyRequest, rep: FastifyReply) {
    try {
        const form = req.body as ConnectRequest;
        if (form.lobby != null && form.lobby != "") {
           var lobby = Lobby.find(form.lobby);
        } else var lobby = Lobby.joinPublicFree(form.lang, form.gameMod);
        const { addPlayer } = lobby.connect();
        const player = new Player(form.pseudo);
        addPlayer(player);
        return connectReply(lobby, player, rep);
    } catch (e) {
        connectErrorReply(e as ConnectError, rep);
        return 
    }
}