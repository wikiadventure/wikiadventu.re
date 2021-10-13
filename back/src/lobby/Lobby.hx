package lobby;

import haxe.Json;
import lobby.packet.handler.ClientPacket;
import lobby.packet.PacketHandler;
import lobby.gameLoop.Phase.VanillaPhaseType;
import response.connect.ConnectionError.ConnectError;
import lobby.player.Player;
import lobby.gameLoop.Phase.PhaseType;
import js.node.Timers;
import js.node.Timers.Timeout;
import haxe.Timer;
import config.Lang;
import utils.crypto.RandomBase32;
using lobby.player.PlayersExtension;
using lobby.packet.PacketHandler;
using lobby.packet.emitter.vanilla.GamePhase.GamePhaseEmitter;
using lobby.packet.emitter.vanilla.PlayerJoin.PlayerJoinEmitter;
using lobby.packet.emitter.vanilla.PlayerLeft.PlayerLeftEmitter;
using lobby.packet.emitter.vanilla.SetOwner.SetOwnerEmitter;
using lobby.GameLoop;
using Lambda;
class Lobby {
    
    public var type:LobbyType;
    public var gameLoop:GameLoop;
    public var heartbeat:Timeout;

    public var totalPlayer:Int = 0; //use to give an id to player when sending info with socket io
    public var slot:Int;
    public var id:Int;

    public var formatId(get,never):String;
    public function get_formatId():String {
        return RandomBase32.encode(id);
    }

    public var passwordHash:String;
    public var lang:Lang;
    public var players:Array<Player>;
    public var ownerId:Int = 0;//we could meaby have multiple owner
    public var owner(get, never):Player;
    public function get_owner() return players.find(p->p.id==ownerId);

    public static var lobbyLimit:Int = 10000;
    public static var privateLimit:Int = 2000;
    public static var lobbyList:Array<Lobby> = [];

    public function new(lang:Lang, type:LobbyType, ?passwordHash:String, slot:Int=15) {
        if (lobbyList.length >= lobbyLimit) throw ConnectError.LobbyLimitReached;
        else if (getPrivateLobbyLength() >= privateLimit) throw ConnectError.PrivateLobbyLimitReached;
        players = new Array<Player>();
        this.lang = lang;
        this.type = type;
        this.slot = slot;
        this.passwordHash = passwordHash;
        heartbeat = Timers.setInterval(checkAlive, 30000);
        insert();
    }
    /**
     * give the lobby a valid id and insert it in the lobbyList
     */
    public function insert() {
        var pos = 0;
        if (lobbyList.length != 0) {
            do {
                id = Std.random(1048576);//32^4
                pos = -search(id);
            } while (pos < 0);
        } else id = Std.random(1048576);
        lobbyList.insert(pos,this);
        log("create the lobby", Info);
    }

    public inline static function search(id:Int) {
        return s(id,0,lobbyList.length-1);
    }

    /**
     * #Recursive - Binary search of a lobby by his id should be called with search
     * @param id of the lobby to search
     * @param l INTERNAL left limit position in the lobbyList
     * @param r INTERNAL right limit position in the lobbyList
     * @return The index of the found lobby in the lobbyList.
     * If not found return a negative index of where it should be.
     */
    private static function s(id:Int,l:Int, r:Int):Int {
        if (lobbyList[r].id >= lobbyList[l].id) {
            var mid = l + Math.floor((r - l) / 2);
            return  lobbyList[mid].id == id ? mid :
                    lobbyList[mid].id > id ? s(id, l, mid - 1) :
                    s(id, mid + 1, r);
        }
        return -r;
    }
    /**
     * Find a lobby by his id ( can throw a connection Error)
     * @param id of the lobby
     * @return the Lobby
     * 
     */
    public static function find(id:Int):Lobby {
        if (lobbyList.length > 0) {
            var pos = search(id);
            if (pos >= 0) return lobbyList[pos];
        }
        throw ConnectError.NoLobbyFoundWithID;
    }


    /**
     * add player to the lobby ( and check if is not already in )
     * @param player to add
     */
    public function addPlayer(player:Player) {
        if (players.length >= slot) throw ConnectError.LobbyFull;
        if (players.lastIndexOf(player) == -1) {
            players.push(player);
            player.id = totalPlayer;
            totalPlayer++;
            kickOnTimeout(player);
            log("new player registered : " + player.uuid + " --> " + player.pseudo, PlayerData);
        }
    }

    public function kickOnTimeout(player:Player):Timeout {
        return Timers.setTimeout(() -> if (player.socket == null) removePlayer(player),30000);
    }
        //TODO: refactor this we don't have to create a new player if the password
    public function connect(player:Player, ?passwordHash:String) {
        if (this.type == Public || this.passwordHash == passwordHash) return addPlayer(player);
        log("connection rejected : " + player.uuid + " --> " + player.pseudo + "provide a wrong password", PlayerData);
        throw ConnectError.InvalidPassword;
    }
    /**
     * remove a player from the lobby,
     * send the new owner if he get remove
     *  and delete the lobby if it go empty
     * @param player to remove
     */
    public function removePlayer(player:Player) {
        log("player left : " + player.uuid + " --> " + player.pseudo, PlayerData);
        players.emitPlayerLeft(player);
        var doOwnerChange = owner == player;
        players.remove(player);
        if (players.length == 0) {
            log("No player left, closing the lobby", Info);
            delete();
            return;
        }
        checkVoteSkip();
        if (doOwnerChange) {
            ownerId = players[0].id;
            players.emitSetOwner(ownerId);
        }

    }

    public function delete() {
        log("delete the lobby", Info);
        Lobby.lobbyList.remove(this);
        this.id = null;
    }

    public function getPlayerFromUUID(uuid:String):Player {
        for (p in players) {
            if (p.uuid == uuid) {
                return p;
            }
        }
        return null;
    }
    public function onWsAuth(ws:Ws, uuid:String) {
        var player = getPlayerFromUUID(uuid);
        if ( player != null ) {
            if (player.assignSocket(ws) ) {
                return onPlayerConnection(player);
            }
            return ws.close(1008, 'Connection rejected because there already a client connected with this playerID');
        }
        return ws.close(1008, 'Connection rejected because playerID is not registered in the lobby');
    }

    public function onPlayerConnection(player:Player) {
        players.emitPlayerJoin(player);
        [player].emitSetOwner(ownerId);
        sendState(player);
        player.socket.on('message', (data:String) -> this.handle(player, data));//handle is method from the static extension packet/PacketHandler.hx
        player.socket.on('close', (data) -> websocketDisconnect(player));
    }

    public function websocketDisconnect(player:Player) {
        player.socket = null;
        kickOnTimeout(player);
    }

    public function sendState(player:Player) {
        var timeLeft = gameLoop.phase.duration - (Timer.stamp() - gameLoop.timestamp);
        [player].emitGamePhase(gameLoop.phase.type, gameLoop.currentRound, timeLeft);
        players.iter((p) -> if (p!=player) [player].emitPlayerJoin(p));
        gameLoop.sendState(player);
        gameLoop.phase.sendState(player);
    }

    public function checkAlive() {
        players.iter((p) -> 
            if(p.socket != null) {
                if (!p.alive) {
                    p.socket.terminate();
                    kickOnTimeout(p);
                } else {
                    p.alive = false;
                    p.socket.ping();
                }
            }
        );
    }

    public function checkVoteSkip() {
        if (players.foreach((p) -> p.voteSkip)) gameLoop.phase.end();
    }

    /**
     * Search a Lobby of type public and add the player to this one, if no lobby is found, it create one.
     * @param player who want to join
     * @return the lobby
     */
    public static function joinPublicFree(player:Player, gameLoop:GameLoopType):Lobby {
        for (l in lobbyList) {
            if (l.type == Public && (l.players.length < l.slot)) {
                if ( l.lang == player.lang ) {
                    if ( gameLoop == null || (l.gameLoop.type == gameLoop)) {
                        return l;
                    }
                }
            }
        }
        // if no free slot are find create a new public lobby
        var lobby = new Lobby(player.lang, Public);
        lobby.select(gameLoop);
        lobby.gameLoop.start();
        return lobby;
    }

    /**
     * get the number of private lobby in the lobby list
     * @return Int
     */
    public static function getPrivateLobbyLength():Int {
        return lobbyList.count((l) -> l.type == Private);
    }

    public static function decodeID(s:String):Int {
        try {
            return RandomBase32.decode(s);
        } catch (e:Dynamic) {
            throw ConnectError.InvalidID;
        }
    }

    public function log( data : Dynamic, logType:LogType, ?pos : haxe.PosInfos ) {
        var time = "[" + Date.now().toString() + "]";
        var f = formatId;
		pos.fileName = time + " lobby " + f + " " + logType + " -> " + pos.fileName;
        haxe.Log.trace(data, pos);
        var fileName = "lobby/" + f + "/" + logType + ".log";
        var content = haxe.Log.formatOutput(data, pos);
        fileLog.Log.inFile(fileName, content);
	}

}

enum abstract LogType(String) {
    var PlayerData;
    var Warning;
    var Error;
    var Info;
}

enum abstract LobbyType(Int) {
    var Public;
    var Private;
    var Twitch;
}
