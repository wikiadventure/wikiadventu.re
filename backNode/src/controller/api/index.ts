import { connect, postConnectUrl } from './connect';
import { getInfo, getInfoUrl } from "./info";
import { getBadge, getBadgeUrl } from './badge';
import type { FastifyInstance } from "fastify";
import { connectOptions } from './connect/type';


export function addRoutes(server:FastifyInstance) {

    // /api/info/:lobbyId
    server.get(getInfoUrl, getInfo);

    // /api/badge
    server.get(getBadgeUrl, getBadge);

    // /api/connect
    server.post(postConnectUrl, connectOptions, connect);
}