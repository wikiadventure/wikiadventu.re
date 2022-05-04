import type { Lobby } from "@game/lobby/class";
import type { Player } from "@game/lobby/player/class";
import type { ClientPacket } from "./type";

export type IPacketHandler =   (lobby:Lobby,  player:Player, p:ClientPacket)=>void

export function handlePacket(lobby:Lobby, player:Player, data:string) {
    var packet:ClientPacket;
    try {
        packet = JSON.parse(data);
    } catch(e) {
        return;
    }
    if (packet.type == null) return;
    const handler = lobby.gameMode.packetHandlers.get(packet.type);
    if (handler == null) return;
    handler(lobby, player, packet);
    lobby.gameMode.onPacket(player, packet);
}