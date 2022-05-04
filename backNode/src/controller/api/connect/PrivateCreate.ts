import { LobbyType } from './../../../game/lobby/types';
import { Lobby } from "@game/lobby/class";
import { Player } from "@game/lobby/player/class";
import type { FastifyRequest, FastifyReply } from "fastify";
import { connectErrorReply, connectReply } from ".";
import type { ConnectError, ConnectRequestPrivateCreate } from "./type";

export function PrivateCreate(req: FastifyRequest, rep: FastifyReply) {
    try {
        const form = req.body as ConnectRequestPrivateCreate;
        const lobby = new Lobby(form.lang, LobbyType.Private, form.password, form.slot);
        lobby.selectGameMode(form.gameMod);
        lobby.gameMode.start();
        const { addPlayer } = lobby.connect(form.password);
        const player = new Player(form.pseudo);
        addPlayer(player);
        return connectReply(lobby, player, rep);
    } catch (e) {
        return connectErrorReply(e as ConnectError, rep);
    }
}