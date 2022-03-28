import type { Lobby } from "../class";
import type { Player } from "../player/class";

/**
 * An interface that define an object that can check if he can process the packet
 */
export interface IPacketHandler  {

    /**
     * A function that process the data of the packet
     */
    process(lobby:Lobby,  player:Player, p:ClientPacket):void;


}
export function handle(lobby:Lobby, player:Player, data:string) {
    var packet:ClientPacket;
    try {
        packet = Json.parse(data);
    } catch(e) {
        return;
    }
    if (packet.type == null) return;
    var handler = lobby.gameLoop.packetHandlers.find(p->p.canProcess(packet));
    if (handler == null) return;
    handler.process(lobby, player, packet);
    lobby.gameLoop.onPacket(player, packet);
}