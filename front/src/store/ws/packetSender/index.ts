import { ws } from "../state";
import { ClientPacket, ClientPacketType } from "./type";

export function send(p:ClientPacket<ClientPacketType>) {
    if (ws.value == null || ws.value.readyState != ws.value.OPEN) return;
    ws.value.send(JSON.stringify(p));
}