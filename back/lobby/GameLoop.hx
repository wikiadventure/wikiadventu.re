package lobby;

import lobby.packet.handler.ClientPacket;
import response.connect.ConnectionError.ConnectError;
import lobby.gameLoop.Classic;
import lobby.gameLoop.Random;
import lobby.player.Player;
import lobby.gameLoop.Phase;
import js.node.Timers.Timeout;
import lobby.packet.PacketEventSubscriber;
using Lambda;

class GameLoop {
    
    public var lobby:Lobby;
    public var type:GameLoopType;
    public var loop:Timeout;
    public var currentPhase:Phase;
    public var timeStampStateBegin:Float;
    public var round:Int;
    public var currentRound:Int;
    public var packetEventSubscribers:Array<PacketEventSubscriber>;

    public function new() {
        packetEventSubscribers = [];
    }

    public function start(?data:Any) {
        currentRound = 1;
        onStart(data);
    }

    public function onStart(?data:Any) {

    }
    public function end(?data:Any) {
        onEnd(data);
        start();
    }
    public function onEnd(?data:Any) {
        
    }

    public function next(?data:Any) {
        
    }
    public function sendCurrentState(player:Player) {
        
    }

    public function onPacket(player:Player, p:InternalPacket) {
        var s = packetEventSubscribers.find((s)->s.type==p.type);
        if (s!=null) s.onPacket(lobby, player, p);
    }
    //TODO: Make the select work like packet handler
    public static function select(type:GameLoopType = Classic, lobby:Lobby, ?round:Int, ?data:Any):GameLoop {
        return switch type {
            case Classic:
                new Classic(lobby, round);
            case Random:
                new Random(lobby, round);
            default:
                throw ConnectError.InvalidGameLoop;
        }
    }

}


enum abstract VanillaGameLoopType(Int) from Int to Int {
    var Classic;
    var Random;
}

enum abstract ModGameLoopType(Int) from Int to Int {
    var Default = 1000;
}

enum abstract GameLoopType(Int) from VanillaGameLoopType to Int from ModGameLoopType to Int  {

}
