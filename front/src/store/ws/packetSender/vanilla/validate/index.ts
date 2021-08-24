import { send } from "../..";
import { ClientPacket } from "../../type";
import { VanillaClientPacketTypeId } from "../type";

export type ClientValidate = {
  page: string
};

export function sendValidate(p:string) {
    var json:ClientPacket<ClientValidate> = {
      type: VanillaClientPacketTypeId.Validate,
      page: p
    };
    send(json);
}