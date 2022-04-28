import type { FastifyReply } from 'fastify';

export function connectErrorReply(code:ConnectError, rep: FastifyReply) {
    rep.type("application/json");
    rep.code(400);
    rep.send({code})
}

export enum ConnectError {
    InvalidMethod = 100, //client error
    InvalidForm,
    InvalidID,
    InvalidLobbyType,
    NoLobbyFoundWithID,
    NoLobbyFoundWithChannelName,
    LobbyFull,
    InvalidPassword,
    InvalidGameMode,
	InvalidTwitchCode,
    InvalidPseudo,
    TwitchIdAlreadyUsed,
    LobbyLimitReached = 200, //server error
    PrivateLobbyLimitReached,
	TwitchConnectionError,
}