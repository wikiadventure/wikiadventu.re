import { Lobby } from "@game/lobby/class";
import { Player } from "@game/lobby/player/class";
import type { FastifyRequest, FastifyReply } from "fastify";
import { connectErrorReply, connectReply } from ".";
import type { ConnectError, ConnectRequestPrivateJoin } from "./type";

export function PrivateJoin(req: FastifyRequest, rep: FastifyReply) {
    try {
        const form = req.body as ConnectRequestPrivateJoin;
        const lobby = Lobby.find(form.lobby);
        const { addPlayer } = lobby.connect();
        const player = new Player(form.pseudo);
        addPlayer(player);
        return connectReply(lobby, player, rep);
    } catch (e) {
        return connectErrorReply(e as ConnectError, rep);
    }
}