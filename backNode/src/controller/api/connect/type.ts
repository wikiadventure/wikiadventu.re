import { type GameModType, VanillaGameModType, ModGameModType } from '@game/lobby/gameMode/types';
import type { LobbyType } from '@game/lobby/types';
import { Lang } from '@lang';
import type { RouteShorthandOptions } from 'fastify';
import { enumValuesToArray as n } from "@utils";
import S from "fluent-json-schema";

export enum LoginType {
    PrivateCreate,
    PrivateJoin,
    TwitchCreate,
    PublicJoin,
    TwitchJoinWith,
    TwitchJoinWithout
}

export type ConnectResponse = {
    lobbyID: string,
    lobbyType: LobbyType,
    gameMod: number,
    slot: number,
    lang: Lang,
    playerID: string
}

export type ConnectRequestBase = {
    type: LoginType,
    lang: Lang,
    pseudo: string,
    slot?: number,
    gameMod?: GameModType,
    password?: string,
    // lobby?: string,
    config: any
}


export const connectBaseSchema = S.object()
    .title("The WikiAdventure connect schema")
    .description("All info needed to connect to different type of lobby")
    .prop("type", S.number().enum(n(LoginType)).required())
    .prop("lang", S.string().enum(n(Lang)).required())
    .prop("pseudo", S.string().maxLength(32).required())
    .prop("gameMod", S.number().enum(n(VanillaGameModType, ModGameModType)).required())
    .prop("slot", S.integer().minimum(1).maximum(50).required())
    .prop("password", S.string().required());

export type ConnectRequestPublicJoin = Omit<ConnectRequestBase, "slot" | "password"> & {
    type: LoginType.PublicJoin,
    lobby?: string,
}

export const publicJoinSchema = connectBaseSchema
    .prop("type", S.number().const(LoginType.PublicJoin))
    .without(["slot", "password"])
    .prop("lobby", S.string());

export type ConnectRequestPrivateJoin = Omit<ConnectRequestBase, "slot" | "gameMod" | "lang"> & {
    type: LoginType.PrivateJoin,
    lobby: string,
}

export const privateJoinSchema = connectBaseSchema
    .prop("type", S.number().const(LoginType.PrivateJoin))
    .without(["slot", "gameMod", "lang"])
    .prop("lobby", S.string().required());

export type ConnectRequestPrivateCreate = ConnectRequestBase & {
    type: LoginType.PrivateCreate,
}

export const privateCreateSchema = connectBaseSchema
    .prop("type", S.number().const(LoginType.PrivateCreate));

export const connectSchema = S.anyOf([publicJoinSchema, privateJoinSchema, privateCreateSchema])

export const connectOptions: RouteShorthandOptions = { schema: { body: connectSchema } };

export type ConnectRequest = {
    type: LoginType,
    lang: Lang,
    pseudo: string,
    slot?: number,
    gameMod?: GameModType,
    password?: string,
    lobby?: string,
    config: any
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
    InvalidGameLoop,
    InvalidTwitchCode,
    InvalidPseudo,
    TwitchIdAlreadyUsed,
    LobbyLimitReached = 200, //server error
    PrivateLobbyLimitReached,
    TwitchConnectionError,
}
