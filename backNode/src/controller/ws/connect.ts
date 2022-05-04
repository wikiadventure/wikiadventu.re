import type { FastifyRequest } from 'fastify';
import type { SocketStream } from '@fastify/websocket';
import { Lobby } from '@game/lobby/class';


type wsConnectParams = {
    id: string, // The id of the lobby or the channel name for twitch one
    uuid: string // The player UUID received from the http api
}

export function connect(ws: SocketStream, req: FastifyRequest) {
    const p = req.params as wsConnectParams;
    try {
        Lobby.find(p.id).onWsAuth(ws.socket, p.uuid);
    } catch(e) {
        ws.socket.close(1008, 'Connection rejected because the server cannot find the lobby with id ' + p.id);
    }
}

export function twitchConnect(ws: SocketStream, req: FastifyRequest) {
    // try {
    //     const params = req.params as wsConnectParams;
    //     Lobby.find(params.id).onWsAuth(ws, uuid);
    // } catch(e:Dynamic) {
    //     ws.socket.close(1008, 'Connection rejected because the server cannot find the lobby with id ' + id);
    // }
}