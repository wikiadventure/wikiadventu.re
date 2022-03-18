import { EventSubscriber } from "src/script/eventSubscribe";
import { players, selfId } from "src/store/player/state";
import { Player } from "src/store/player/type";
import { Packet, PacketHandler } from "../../type";
import { VanillaPacketTypeId } from "../type";

export interface WsPlayerJoin {
    pseudo:string,
    id:number,//The player id
    score:number,
    voteSkip:boolean,
    self:boolean
}

export const onPlayerJoin:EventSubscriber<WsPlayerJoin> = new EventSubscriber();

export function canProcess(p:Packet<unknown>): p is Packet<WsPlayerJoin> {
    return p.type == VanillaPacketTypeId.PlayerJoin;
}

export async function process(p:WsPlayerJoin) {
    const player:Player = {
        pseudo: p.pseudo,
        id: p.id,
        score: p.score,
        voteSkip: p.voteSkip,
        isConnected: true
    }
    if (p.self) selfId.value = p.id;
    players.value.push(player);
    onPlayerJoin.forEach(f=>f(p));
}

export const playerJoinHandler:PacketHandler<WsPlayerJoin> = {
    canProcess,
    process
}