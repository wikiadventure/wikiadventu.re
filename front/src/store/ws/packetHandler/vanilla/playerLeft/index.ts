import { EventSubscriber } from "src/script/eventSubscribe";
import { players } from "src/store/player/state";
import { Packet, PacketHandler } from "../../type";
import { VanillaPacketTypeId } from "../type";

export interface WsPlayerLeft {
    id:number//The player id
}

export const onPlayerLeft:EventSubscriber<WsPlayerLeft> = new EventSubscriber();

export function canProcess(p:Packet<unknown>): p is Packet<WsPlayerLeft> {
    return p.type == VanillaPacketTypeId.PlayerLeft;
}

export async function process(p:WsPlayerLeft) {
    var player = players.value.find(s => s.id == p.id);
    if (player) player.isConnected = false;
    onPlayerLeft.forEach(f=>f(p));
}

export const playerLeftHandler:PacketHandler<WsPlayerLeft> = {
    canProcess,
    process
}