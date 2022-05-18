import type { ClientPacket, ClientPacketType } from './type';
import type { Lobby } from "@lobby/class";
import type { Player } from "@player/class";


export type PacketSubscriberCallback = (lobby:Lobby, player:Player, p:ClientPacket)=>void

export function subscribe(map:Map<ClientPacketType, PacketSubscriberCallback[]>, type:ClientPacketType, callback: PacketSubscriberCallback) {
    if (map.has(type)) map.get(type)?.push(callback);
    else map.set(type, [callback]);
    return () => map.get(type)?.remove(callback);
}