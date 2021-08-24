import { send } from "../..";
import { ClientPacket } from "../../type";
import { VanillaClientPacketTypeId } from "../type";

export type ClientVote = {
  vote:string
};

export function sendVote(v:string) {
  var json:ClientPacket<ClientVote> = {
    type: VanillaClientPacketTypeId.Vote,
    vote: v
  };
  send(json);
}