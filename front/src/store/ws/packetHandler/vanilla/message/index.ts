import { EventSubscriber } from "src/script/eventSubscribe";
import { messages } from "src/store/chat/state";
import { Message } from "src/store/chat/type";
import { Packet, PacketHandler, PacketType } from "../../type";
import { VanillaPacketTypeId } from "../type";

export interface WsMessage {
    id:number,//The player id
    data:string
}

export const onMessage:EventSubscriber<WsMessage> = new EventSubscriber();

export function canProcess(p:Packet<unknown>): p is Packet<WsMessage> {
    return p.type == VanillaPacketTypeId.Message;
}

export async function process(m:WsMessage) {
    var message:Message = {
        playerID: m.id,
        content: m.data,
        timeStamp: Date.now()  
    }
    messages.value.push(message);
    onMessage.forEach(f=>f(m));
}

export const messageHandler:PacketHandler<WsMessage> = {
    canProcess,
    process
}