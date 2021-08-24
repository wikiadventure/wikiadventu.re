import { send } from "../..";
import { ClientPacket } from "../../type";
import { VanillaClientPacketTypeId } from "../type";

export type ClientResetVote = {};

export function sendResetVote() {
  var json:ClientPacket<ClientResetVote> = {
    type: VanillaClientPacketTypeId.ResetVote
  };
  send(json);
}