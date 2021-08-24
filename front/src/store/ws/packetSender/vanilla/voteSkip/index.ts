import { send } from "../..";
import { ClientPacket } from "../../type";
import { VanillaClientPacketTypeId } from "../type";

export type ClientVoteSkip = {};

export function sendVoteSkip() {
    var json:ClientPacket<ClientVoteSkip> = {
      type: VanillaClientPacketTypeId.VoteSkip,
    };
    send(json);
}