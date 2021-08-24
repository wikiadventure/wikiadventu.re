import { EventSubscriber } from "src/script/eventSubscribe";
import { startTimer } from "src/store/lobby/actions";
import { GamePhaseType } from "src/store/lobby/game/phase/type";
import { gamePhase, round, time, timeLeft } from "src/store/lobby/state";
import { players } from "src/store/player/state";
import { Packet, PacketHandler, PacketType } from "../../type";
import { VanillaPacketTypeId } from "../type";

export interface WsGamePhase {
    phase:GamePhaseType,
    round:number,
    time:number
}

export const onGamePhase:EventSubscriber<WsGamePhase> = new EventSubscriber();

export function canProcess(p:Packet<unknown>): p is Packet<WsGamePhase> {
    return p.type == VanillaPacketTypeId.GamePhase;
}

export async function process(g:WsGamePhase) {
    if (g.round == 1) players.value = players.value.filter(p => p.isConnected);
    players.value.forEach(p => p.voteSkip = false);
    gamePhase.value = g.phase;
    round.value = g.round;
    time.value = g.time*1000;
    startTimer();
    onGamePhase.forEach(f=>f(g));
}

export const gamePhaseHandler:PacketHandler<WsGamePhase> = {
    canProcess,
    process
}