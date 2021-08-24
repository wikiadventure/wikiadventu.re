import { EventSubscriber } from "src/script/eventSubscribe";
import { players } from "src/store/player/state";
import { Packet, PacketHandler } from "../../type";
import { VanillaPacketTypeId } from "../type";

export interface WsVoteSkip {
    id:number, //The player id who skip
    state:boolean
}

export const onVoteSkip:EventSubscriber<WsVoteSkip> = new EventSubscriber();

export function canProcess(p:Packet<unknown>): p is Packet<WsVoteSkip> {
    return p.type == VanillaPacketTypeId.VoteSkip;
}

export async function process(v:WsVoteSkip) {
    var player = players.value.find(p => p.id == v.id);
    if (player) player.voteSkip = v.state;
    onVoteSkip.forEach(f=>f(v));
}

export const voteSkipHandler:PacketHandler<WsVoteSkip> = {
    canProcess,
    process
}