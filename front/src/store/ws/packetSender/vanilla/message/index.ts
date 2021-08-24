import { send } from "../..";
import { ClientPacket } from "../../type";
import { VanillaClientPacketTypeId } from "../type";

export type ClientMessage = {
    data: string
};

export function sendMessage(data:string) {
  var json:ClientPacket<ClientMessage> = {
    type: VanillaClientPacketTypeId.Message,
    data: data
  };
  send(json);
};