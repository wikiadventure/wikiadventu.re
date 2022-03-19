import { EventSubscriber } from "src/script/eventSubscribe";
import { winnerPageHistory, winnerTime } from "src/store/player/state";
import { Packet, PacketHandler } from "../../type";
import { VanillaPacketTypeId } from "../type";

export interface WsPath {
    id:number,//The player id
    pages:string[],
    time:number
}

export const onPath:EventSubscriber<WsPath> = new EventSubscriber();

export function canProcess(p:Packet<unknown>): p is Packet<WsPath> {
    return p.type == VanillaPacketTypeId.Path;
}

export async function process(p:WsPath) {
    winnerPageHistory.value = p.pages;
    winnerTime.value = p.time;
    onPath.forEach(f=>f(p));
}

export const pathHandler:PacketHandler<WsPath> = {
    canProcess,
    process
}