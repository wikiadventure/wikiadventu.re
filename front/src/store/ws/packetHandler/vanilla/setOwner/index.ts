import { EventSubscriber } from "src/script/eventSubscribe";
import { ownerId } from "src/store/player/state";
import { Packet, PacketHandler } from "../../type";
import { VanillaPacketTypeId } from "../type";

export interface WsSetOwner {
    id:number//The player id
}

export const onSetOwner:EventSubscriber<WsSetOwner> = new EventSubscriber();

export function canProcess(p:Packet<unknown>): p is Packet<WsSetOwner> {
    return p.type == VanillaPacketTypeId.SetOwner;
}

export async function process(s:WsSetOwner) {
    ownerId.value = s.id;
    onSetOwner.forEach(f=>f(s));
}

export const setOwnerHandler:PacketHandler<WsSetOwner> = {
    canProcess,
    process
}