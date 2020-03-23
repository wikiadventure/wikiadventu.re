package lobby;

import haxe.Json;
import js.lib.Promise;
import js.node.Https.HttpsRequestOptions;
import js.node.Https;
import haxe.Timer;
import async.IO;
import js.node.socketio.Server.Namespace;
import js.node.socketio.Socket;
import haxe.io.Bytes;
import lobby.player.Player;
import config.Language;
import haxe.crypto.Base64;

class Lobby {
    
    public var io:Namespace;
    public var type:LobbyType;
    public var state:LobbyState;
    public var timeStampStateBegin:Float;

    public var slot:Int;
    public var id:Int;
    public var passwordHash:String;
    public var language:Language;
    public var playerList:Array<Player>;
    public var round:Int;
    public var currentRound:Int;
    public var playTimeOut:Int; //time in second before a round end automatically
    public var voteTimeOut:Int;

    public static var lobbyLimit:Int = 10000;
    public static var privateLimit:Int = 200;
    public static var lobbyList:Array<Lobby>;

    /**
     * instanciate the lobby list
     */
    public static function init() {
        lobbyList = new Array<Lobby>();
    }

    public function new(language : Language, type:LobbyType, slot:Int=10, round:Int=3, playTimeOut:Int=600, voteTimeOut:Int=30) {
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
        this.playTimeOut = playTimeOut;
        this.voteTimeOut = voteTimeOut;
        
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
        lobby.startVotingState();
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

    public function getPlayerFromSocket(socket:Socket):Player {
        for (p in playerList) {
            if (p.socket == socket) {
                return p;
            }
        }
        return null;
    }

    public function getPlayerFromUUID(uuid:String):Player {
        for (p in playerList) {
            if (p.uuid == uuid) {
                return p;
            }
        }
        return null;
    }

    /*public function isUUIDvalid(uuid:String):Bool {
        for (p in playerList) {
            if (p.uuid == uuid) {
                return true;
            }
        }
        return false;
    }*/

    public function initNamespace() {
        io = IO.server.of('/'+encodeID(id));
        io.use(function (socket, next) {
            var player = getPlayerFromUUID(untyped __js__("socket.handshake.query.playerID"));
            if ( player != null ) {
                if (player.assignSocket(socket) ) return untyped __js__("next()");
                return untyped __js__("next(new Error('Connection rejected because there already a client connected with this playerID'))");
            }
            return untyped __js__("next(new Error('Connection rejected because playerID is not registered in the lobby'))");
            
        });

        io.on('connection', function(socket:Socket, request) {
            io.emit('message', "connected to the lobby"+ id);
            var timeLeft = voteTimeOut - (Timer.stamp() - timeStampStateBegin);
            socket.emit('gameContent', "gameState:" + state + "|" + timeLeft );
            socket.on('message', function (data) {
                var player = getPlayerFromSocket(socket);
                if (player == null) return;

                io.emit('message', player.pseudo + " : " + data);
            });
            socket.on('disconnect', function (data) {
                
            });
            socket.on('pageRequest', function (data) {
                
            });
            socket.on('gameContent', function (data) {

            });
            socket.on('vote', function (data) {
                vote(socket, data);
            });
        });
    }

    public function vote(socket:Socket, content:String) {
        var player = getPlayerFromSocket(socket);
        if (player != null) player.votingSuggestion = content;
    }

    public function startVotingState() {
        state = Voting;
        io.emit('gameContent', "gameState:Voting|31");
        timeStampStateBegin = Timer.stamp();
        Timer.delay(function () {
            selectPage();
        },31000);
        
    }

    public function selectPage() {
        var promiseList = new Array<Promise<Bool>>();
        var urlList = new Array<String>();
        trace("Starting page selection");
        for (i in 0...playerList.length) {
            var title = playerList[i].votingSuggestion;
            if (title != null) {
                var promise = new Promise<Bool>(
                    function (resolve, reject) {
                        var options:HttpsRequestOptions =  {
                            hostname: LanguageTools.getURL(language),
                            path: "/w/api.php?action=query&list=search&srlimit=1&srnamespace=0&srsearch=intitle:" + title + "&format=json&srprop="
                        };
                        var request = Https.request(options, function (response) {
                            response.on('data', function (data) {
                                try {
                                    var parsed:WikiResponse = Json.parse(data);
                                    if (parsed.query.searchinfo.totalhits == 0) {
                                        getRandomURL(urlList, resolve, reject);
                                    } else {
                                        var spaceRegex = ~/ +/g;
                                        var url =  spaceRegex.replace(parsed.query.search[0].title, "_");
                                        urlList.push(url);
                                        resolve(true);
                                    }
                                } catch(e:Dynamic) {
                                    reject("SEVERE server Error : " + e);
                                }
                            });
                        });
                        request.on('error', function (e) {
                            trace(e);
                        });
                        request.end();
                    }
                );
                promiseList.push(promise);
            } else {
                var promise = new Promise<Bool>(
                    function (resolve, reject) {
                        getRandomURL(urlList, resolve, reject);
                    }
                );
                promiseList.push(promise);
            }
        }
        if (playerList.length < 2) {
            var promise = new Promise<Bool>(
                function (resolve, reject) {
                    getRandomURL(urlList, resolve, reject);
                }
            );
            promiseList.push(promise);
        }
        Promise.all(promiseList).then(
            function(value) {
                var randomStart = Std.random(urlList.length);
                var randomEnd:Int;
                do {
                    randomEnd = Std.random(urlList.length);
                } while (randomEnd == randomStart);
                sendingPageToClient(urlList[randomStart], urlList[randomEnd]);

            }, function(reason) {
                trace("SEVERE something wrong append : " + reason);
        });
    }

    public function sendingPageToClient(startPage:String, endPage:String) {
        trace("page send");
        io.emit('voteResult', startPage + '?' + endPage);
    }
     
    public function getRandomURL(urlList:Array<String>, resolve:(value:Bool) -> Void, reject:(reason:Dynamic) -> Void) {
        var options:HttpsRequestOptions =  {
            hostname: LanguageTools.getURL(language),
            path: "/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1"
        }
        var request = Https.request(options, function (response) {
            response.on('data', function (data) {
                try {
                    var parsed:WikiResponse = Json.parse(data);
                    var spaceRegex = ~/ +/g;
                    var url =  spaceRegex.replace(parsed.query.random[0].title, "_");
                    urlList.push(url);
                    resolve(true);
                    trace("success : random page " + url);
    
                } catch(e:Dynamic) {
                    trace("error: random page request fail");
                    trace(e);
                    reject("SEVERE server Error : " + e);
                }   
            });
        });
        request.on('error', function (e) {
            trace(e);
        });
        request.end();

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

enum abstract LobbyState(String) from String to String {
    var Voting;
    var Playing;
}

typedef WikiResponse = {
    var query:WikiQuery;
}
typedef WikiQuery = {
    var searchinfo:{
        var totalhits:Int;
    };
    var search:Array<WikiResult>;
    var random:Array<WikiResult>;
}
typedef WikiResult = {
    var ns:Int;
    var title:String;
    var pageid:Int;
}
