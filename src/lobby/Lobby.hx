package lobby;

import async.IO;
import haxe.Int32;
import haxe.Int64;
import js.node.socketio.Server.Namespace;
import js.node.socketio.Socket;
import haxe.io.BytesBuffer;
import haxe.io.Bytes;
import lobby.player.Player;
import config.Language;
import haxe.crypto.Base64;

class Lobby {
    
    public var io:Namespace;

    public var type:LobbyType;
    public var slot:Int;
    public var id:Int;
    public var passwordHash:String;
    public var language:Language;
    public var playerList:Array<Player>;
    public var round:Int;
    public var currentRound:Int;
    public var timeOut:Int; //time in second before a round end automatically

    public static var lobbyLimit:Int = 1000;
    public static var privateLimit:Int = 200;
    public static var lobbyList:Array<Lobby>;

    /**
     * instanciate the lobby list
     */
    public static function init() {
        lobbyList = new Array<Lobby>();
    }

    public function new(language : Language, type:LobbyType, slot:Int=10, round:Int=3, timeOut:Int=600) {
        if (lobbyList.length >= lobbyLimit) {
            throw "Lobby limit has been reached!";
        } else if (getPrivateLobbyLength() >= privateLimit) {
            throw "Private lobby limit has been reached!";
        }
        playerList = new Array<Player>();
        this.language = language;
        this.type = type;
        this.slot = slot;
        this.round = round;
        currentRound = 1;
        this.timeOut = timeOut;
        
        
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
    /**
     * Search a Lobby of type public and the player to this one, if no lobby is found, it create one.
     * @param player who want to join
     * @return the lobby
     */
    public static function joinPublicFree(player:Player):Lobby {
        for (l in lobbyList) {
            if (l.type == Public && (l.slot > l.playerList.length)) {
                if ( l.language == player.language ) {
                    l.addPlayer(player);
                    return l;
                }
            }
        }
        // if no free slot are find create a new public lobby
        var lobby = new Lobby(player.language, Public);
        lobby.giveID();
        lobby.initNamespace();
        lobby.addPlayer(player);
        return lobby;
    }
    /**
     * add player to the lobby ( and check if is not already in )
     * @param player to add
     */
    public function addPlayer(player:Player) {
        if (playerList.lastIndexOf(player) == -1) {
            playerList.push(player);
        }
    }
    /**
     * remove a player from the lobby and remove the lobby if he go empty
     * @param player to remove
     */
    public function removePlayer(player:Player) {
        playerList.remove(player);
        if (playerList.length == 0) {
            Lobby.lobbyList.remove(this);
        }
    }
    /**
     * get the number of private lobby in the lobby list
     * @return Int
     */
    public static function getPrivateLobbyLength():Int {
        var n = 0;
        for (l in lobbyList) {
            if (l.type == Private) n++;
        }
        return n;
    }
    /**
     * transform the url string into the lobby id
     * @param id in url string format
     * @return Int The lobby id
     */
    public static function decodeID(id:String):Int {
        var bytesValue = Base64.urlDecode(id);
        var stringValue = bytesValue.getString(0,bytesValue.length);
        var intValue = Std.parseInt(stringValue);
        if(intValue == null) {
            throw "invalid ID";
        }
        return intValue;
    }
    /**
     * tranform the lobby id into url string
     * @param id in Int format
     * @return the url String
     */
    public static function encodeID(id:Int):String {
        var bytesValue = Bytes.ofString(Std.string(id));
        var result = Base64.urlEncode(bytesValue);
        return result;
    }

    public function getPseudoFromUUID(uuid:String):String {
        for (p in playerList) {
            if (p.uuid == uuid) {
                return p.pseudo;
            }
        }
        return null;
    }

    public function initNamespace() {
        io = IO.server.of('/'+encodeID(id));
        io.on('connection', function(socket:Socket, request) {
            io.emit('message', "connected to the lobby"+ id);
            socket.on('message', function (data) {
                trace(data);
                var sepPos = cast(data, String).indexOf(":");
                if (sepPos == -1) return;
                var parsedID = cast(data, String).substring(0, sepPos);
                var parsedContent = cast(data, String).substring(sepPos+1);
                var playerName = getPseudoFromUUID(parsedID);
                if (playerName == null) return;
                io.emit('message', playerName + ": " + parsedContent);
            });

            socket.on('pageRequest', function (data) {
                
            });
            socket.on('gameContent', function (data) {
                
            });


        });
    }

    public function isLobbyPlayer(socket:Socket):Bool {
        return true;
        return false;
    }

}

enum abstract LobbyType(Int) {
    var Public;
    var Private;
}
