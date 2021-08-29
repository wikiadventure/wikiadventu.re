package lobby;

import haxe.Json;
import lobby.packet.handler.ClientPacket;
import lobby.packet.PacketHandler;
import lobby.gameLoop.Phase.VanillaPhaseType;
import response.connect.ConnectionError.ConnectError;
import lobby.player.Player;
import lobby.gameLoop.Phase.PhaseType;
import lobby.GameLoop;
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
using Lambda;
class Lobby {
    
    public var type:LobbyType;
    public var gameLoop:GameLoop;
    public var heartbeat:Timeout;

    public var totalPlayer:Int = 0; //use to give an id to player when sending info with socket io
    public var slot:Int;
    public var id:Int;

    public var formatID(get,never):String;
    public function get_formatID():String {
        return RandomBase32.encode(id);
    }

    public var passwordHash:String;
    public var language:Lang;
    public var players:Array<Player>;
    public var ownerId:Int = 0;//we could meaby have multiple owner
    public var owner(get, never):Player;
    public function get_owner() return players.find(p->p.id==ownerId);
    public var packetHandlers:Array<PacketHandler>;

    public static var lobbyLimit:Int = 10000;
    public static var privateLimit:Int = 2000;
    public static var lobbyList:Array<Lobby>;

    /**
     * instanciate the lobby list
     */
    public static function init() {
        lobbyList = new Array<Lobby>();
    }

    public function new(language:Lang, type:LobbyType, ?passwordHash:String, slot:Int=15) {
        if (lobbyList.length >= lobbyLimit) throw ConnectError.LobbyLimitReached;
        else if (getPrivateLobbyLength() >= privateLimit) throw ConnectError.PrivateLobbyLimitReached;
        players = new Array<Player>();
        this.language = language;
        this.type = type;
        this.slot = slot;
        this.passwordHash = passwordHash;
        heartbeat = Timers.setInterval(checkAlive, 30000);
    }
    /**
     * give the lobby a valid id, loop until it found a unused one
     */
    public function giveID() {
        var pos = -1;
        do {
            id = Std.random(1048576);
            pos = checkIdUsed(id);
        } while (pos == -1);

        lobbyList.insert(pos,this);
        log("create the lobby", Info);
    }

    /**
     * Check if the randomly generated id is used
     * @param id futur id of the lobby
     * @return Int the position in the list of the futur lobby, return -1 if the id is already taken
     */
    //tested perform quite well can insert correctly 1000 lobby when there already 9000 lobby in 0.000013 ~ 0.000014
    public static function checkIdUsed(id:Int):Int {
        var i=0;
        for (l in lobbyList) {
            if (l.id > id) return i; // because the list is sorted, so if the id is inferior to the next one it means the id is between the last and the next one
            if (l.id == id) return -1;
            i++;
        }
        return i;
    }

    public static function find(id:Int):Lobby {
        for (l in lobbyList) {
            if (l.id > id) break;
            if (l.id == id) return l;
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
        sendCurrentState(player);
        player.socket.on('message', (data:String) -> this.handle(player, data));//handle is method from the static extension packet/PacketHandler.hx
        player.socket.on('close', (data) -> websocketDisconnect(player));
    }

    public function websocketDisconnect(player:Player) {
        player.socket = null;
        kickOnTimeout(player);
    }

    public function sendCurrentState(player:Player) {
        var timeLeft = gameLoop.currentPhase.duration - (Timer.stamp() - gameLoop.timeStampStateBegin);
        [player].emitGamePhase(gameLoop.currentPhase.type, gameLoop.currentRound, timeLeft);
        players.iter((p) -> if (p!=player) [player].emitPlayerJoin(p));
        gameLoop.sendCurrentState(player);
    }

    /**
     * assign the vote to the [vote] variable of the player
     * PS: we don't verify if the title lead to something, we will in the [selectPage()] method
     * the client also do the verification so they are aware if there title lead to something
     * @param player from which the data come from
     * @param content the page title we receive
     */
    public function vote(player:Player, content:String) {
        log("player vote : " + player.uuid + " --> " + player.pseudo + " | " + content, PlayerData);
        if (content.length > 255) return;
        player.vote = content;
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
        if (players.foreach((p) -> p.voteSkip)) gameLoop.currentPhase.end();
    }

    /**
     * Search a Lobby of type public and add the player to this one, if no lobby is found, it create one.
     * @param player who want to join
     * @return the lobby
     */
    public static function joinPublicFree(player:Player, ?gameLoop:GameLoopType):Lobby {
        for (l in lobbyList) {
            if (l.type == Public && (l.players.length < l.slot)) {
                if ( l.language == player.language ) {
                    if ( gameLoop == null || (l.gameLoop.type == gameLoop)) {
                        return l;
                    }
                }
            }
        }
        // if no free slot are find create a new public lobby
        var lobby = new Lobby(player.language, Public);
        lobby.giveID();// giveID method also add the lobby to the lobbylist
        lobby.gameLoop = GameLoop.select(gameLoop,lobby);
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
        var f = formatID;
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
