package lobby.packet;

import lobby.player.Player;
import lobby.packet.handler.ClientPacket.ClientPacketType;
using Lambda;

class PacketEventSubscriber {
    public var type:InternalClientPacketType;
    public var callbacks:Array<(lobby:Lobby, player:Player, p:Any)->Void>;

    function new(type:InternalClientPacketType) {
        this.type = type;
        this.callbacks = [];
    }

    public static function subscribe(lobby:Lobby, type:InternalClientPacketType, callback:(lobby:Lobby, player:Player, p:Any)->Void) {
        var subscriber = lobby.gameLoop.packetEventSubscribers.find((p)->p.type==type);
        if (subscriber == null) {
            subscriber = new PacketEventSubscriber(type);
            lobby.gameLoop.packetEventSubscribers.push(subscriber);
        }
        subscriber.callbacks.push(callback);
        return () -> subscriber.callbacks.remove(callback);
    }

    public function onPacket(lobby:Lobby, player:Player, p:Any) {
        callbacks.iter(f->f(lobby,player,p));
    }

}
/**
 * Packet use only with PacketEventSubscriber to only trigger different event 
 * according to the outcome of the process
 */
enum abstract InternalPacketType(Int) from Int to Int {
    var ValidationSucess;
    var ValidationFailed;
}

enum abstract InternalClientPacketType(Int) from ClientPacketType to Int from InternalPacketType to Int {
}

typedef InternalPacket = {
    type: InternalClientPacketType
}
