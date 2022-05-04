import type { Lobby } from "@game/lobby/class";
import type { InternalPacket, InternalPacketType } from './type';
import type { Player } from '@game/lobby/player/class';

export type PacketSubscriberCallback = (lobby:Lobby, player:Player, p:InternalPacket)=>void

export function subscribe(map:Map<InternalPacketType, PacketSubscriberCallback[]>, type:InternalPacketType, callback: PacketSubscriberCallback) {
    if (map.has(type)) map.get(type)?.push(callback);
    else map.set(type, [callback]);
    return () => map.get(type)?.remove(callback);
}