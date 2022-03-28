import type { FastifyReply, FastifyRequest } from "fastify";

export const getBadgeUrl = '/api/info/:lobbyId';

export async function getBadge(req: FastifyRequest, rep: FastifyReply) {
    //TODO
    // const n = WS.server.clients.size;
    const n = 1;
    const x:BadgeReply = {
        schemaVersion: 1,
        label: "Wiki Adventure",
        message: n + " online" + (n > 1 ? "s" : ""),
        color: "green"
    };
    rep.send(x);
}

type BadgeReply = {
    schemaVersion: number,
    label: string,
    message: string,
    color: string
}
