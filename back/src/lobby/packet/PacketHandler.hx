package lobby.packet;

import haxe.Json;
import lobby.player.Player;
import lobby.packet.handler.ClientPacket;
using Lambda;

/**
 * An interface that define an object that can check if he can process the packet
 */
 class PacketHandler {
    public function new() {
        
    }
    /**
     * A type guard that verify if packet type match given one
     */
    public function canProcess(p: ClientPacket):Bool {
       return false; 
    }
    /**
     * A function that process the data of the packet
     */
    public function process(lobby:Lobby,  player:Player, p: ClientPacket) {
        
    }

    public static function handle(lobby:Lobby, player:Player, data:String) {
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

}