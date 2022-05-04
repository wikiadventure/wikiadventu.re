import { Connect, postConnectUrl } from './connect';
import { Info, getInfoUrl } from "./info";
import { Badge, getBadgeUrl } from './badge';
import type { FastifyInstance } from "fastify";
import { connectOptions } from './connect/type';


export function addRoutes(server:FastifyInstance) {

    // /api/info/:lobbyId
    server.get(getInfoUrl, Info);

    // /api/badge
    server.get(getBadgeUrl, Badge);

    // /api/connect
    server.post(postConnectUrl, connectOptions, Connect);

    // server.post()
}