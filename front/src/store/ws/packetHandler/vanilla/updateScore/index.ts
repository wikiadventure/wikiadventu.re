import { EventSubscriber } from "src/script/eventSubscribe";
import { players } from "src/store/player/state";
import { Packet, PacketHandler } from "../../type";
import { VanillaPacketTypeId } from "../type";

export interface WsUpdateScore {
    id:number,//The player id
    score:number
}

export const onUpdateScore:EventSubscriber<WsUpdateScore> = new EventSubscriber();

export function canProcess(p:Packet<unknown>): p is Packet<WsUpdateScore> {
    return p.type == VanillaPacketTypeId.UpdateScore;
}

export async function process(u:WsUpdateScore) {
    var player = players.value.find(p => p.id == u.id);
    if (player) player.score = u.score;
    onUpdateScore.forEach(f=>f(u));
}

export const updateScoreHandler:PacketHandler<WsUpdateScore> = {
    canProcess,
    process
}