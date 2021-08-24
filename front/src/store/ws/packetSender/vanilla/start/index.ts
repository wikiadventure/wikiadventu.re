import { send } from "../..";
import { ClientPacket } from "../../type";
import { VanillaClientPacketTypeId } from "../type";

export type ClientStart = {};

export function sendStart() {
    var json:ClientPacket<ClientStart> = {
      type: VanillaClientPacketTypeId.Start,
    };
    send(json);
}