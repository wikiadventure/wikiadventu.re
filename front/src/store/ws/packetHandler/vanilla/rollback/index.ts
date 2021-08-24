import { EventSubscriber } from "src/script/eventSubscribe";
import { Packet, PacketHandler } from "../../type";
import { VanillaPacketTypeId } from "../type";

export interface WsRollback {
    page:string
}

export const onRollback:EventSubscriber<WsRollback> = new EventSubscriber();

export function canProcess(p:Packet<unknown>): p is Packet<WsRollback> {
    return p.type == VanillaPacketTypeId.UpdateScore;
}

export async function process(r:WsRollback) {
    onRollback.forEach(f=>f(r));
}

export const rollbackHandler:PacketHandler<WsRollback> = {
    canProcess,
    process
}