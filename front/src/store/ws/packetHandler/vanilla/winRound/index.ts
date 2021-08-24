import { EventSubscriber } from "src/script/eventSubscribe";
import { winnerId } from "src/store/player/state";
import { Packet, PacketHandler } from "../../type";
import { VanillaPacketTypeId } from "../type";

export interface WsWinRound {
    id:number//The player id
}

export const onWinRound:EventSubscriber<WsWinRound> = new EventSubscriber();

export function canProcess(p:Packet<unknown>): p is Packet<WsWinRound> {
    return p.type == VanillaPacketTypeId.WinRound;
}

export async function process(w:WsWinRound) {
    winnerId.value = w.id;
    onWinRound.forEach(f=>f(w));
}

export const winRoundHandler:PacketHandler<WsWinRound> = {
    canProcess,
    process
}