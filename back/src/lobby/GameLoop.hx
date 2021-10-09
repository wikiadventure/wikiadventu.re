package lobby;

import lobby.packet.PacketHandler;
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
    
    public var type:GameLoopType;
    public var lobby:Lobby;
    public var phase:Phase;
    public var loop:Timeout;
    public var timestamp:Float;
    public var round:Int;
    public var currentRound:Int;
    public var packetEventSubscribers:Array<PacketEventSubscriber>;
    public var packetHandlers:Array<PacketHandler>;

    public function new() {
        packetEventSubscribers = [];
        packetHandlers = [];
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
    /**
     * an abstract function that should start a new phase depending on the previous one
     * you can pass any data to it
     * @param data 
     */
    public function next(?data:Any) {
        
    }

    /**
     * an abstract function that should send every info so a player can join mid game
     * @param player to send to
     */
    public function sendState(player:Player) {
        
    }

    public function onPacket(player:Player, p:InternalPacket) {
        var s = packetEventSubscribers.find((s)->s.type==p.type);
        if (s!=null) s.onPacket(lobby, player, p);
    }
    //TODO: Make the select work like packet handler
    public static function select(lobby:Lobby, type:GameLoopType, ?config:Any) {
        config = config != null ? config : {};
        lobby.gameLoop = switch type {
            case Classic: new Classic(lobby, config);
            case Random: new Random(lobby, config);
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

/**
 * An abstract that clamp the round and assign a default value if null
 */
abstract Round(Int) from Int to Int {

    /**
     * create a correct round
     * @param v the round input value
     * @param d the round default value
     * @return a correct round
     */
    inline public function new(s:String,d:Int) {
        var v = Std.parseInt(s);
        this = v == null ? d : v < 1 ? 1 : v > 50 ? 50 : v;
    }

}

//TODO: we might to add -1 to handle endless phase
/**
 * An abstract that clamp the phase duration and assign a default value if null
 */
abstract PhaseDuration(Int) from Int to Int {

    /**
     * create a correct phase duration
     * @param v the phase duration input value
     * @param d the phase duration default value
     * @return a correct phase duration
     */
    inline public function new(s:String,d:Int) {
        var v = Std.parseInt(s);
        this = v == null ? d : v < 0 ? 0 : v > 3600 ? 3600 : v;
    }

}
