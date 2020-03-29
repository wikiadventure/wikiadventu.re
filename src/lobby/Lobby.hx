package lobby;

import js.node.Buffer;
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
    public var loop:Timer;

    public var startPage:String;
    public var endPage:String;

    public var slot:Int;
    public var id:Int;
    public var passwordHash:String;
    public var language:Language;
    public var playerList:Array<Player>;
    public var round:Int;
    public var currentRound:Int;
    public var playTimeOut:Int; //time in second before a round end automatically
    public var voteTimeOut:Int; //time of the Voting state
    public var roundFinishTimeOut:Int = 10; //time between the end of the play state and the begin of the vote state
    public var gameFinishTimeOut:Int = 20;

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

    /**
     * create a socket io namespace for the lobby and assign data handler to each channel
     */
    public function initNamespace() {
        io = IO.server.of('/'+encodeID(id));//the name of the lobby is his id encoded in Base64
        /** 
        * middleware that accept connection only from client that provide a correct player uuid from playerList of the lobby
        * if the provided uuid is valid assign the socket to the player
        */
        io.use(function (socket, next) {
            var player = getPlayerFromUUID(untyped __js__("socket.handshake.query.playerID"));
            if ( player != null ) {
                if (player.assignSocket(socket) ) return untyped __js__("next()");
                return untyped __js__("next(new Error('Connection rejected because there already a client connected with this playerID'))");
            }
            return untyped __js__("next(new Error('Connection rejected because playerID is not registered in the lobby'))");
            
        });

        io.on('connection', function(socket:Socket, request) {
            var player = getPlayerFromSocket(socket);
            if (player == null) return;
            io.emit('message', player.pseudo + " join the lobby!");
            var timeLeft = currentStateTimeOut() - (Timer.stamp() - timeStampStateBegin);
            socket.emit('gameContent', "gameState:" + state + "|" + timeLeft );
            if (state == Playing) socket.emit('voteResult', startPage + '?' + endPage);
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
            socket.on('validateJump', function (data) {
                validateJump(socket, data);
            });
        });
    }


    /**
     * get the current state duration
     * @return Int current state duration in seconde
     */
    public function currentStateTimeOut():Int {
        switch state {
            case Playing:
                return playTimeOut;
            case Voting:
                return voteTimeOut;
            case RoundFinish:
                return roundFinishTimeOut;
            case GameFinish:
                return gameFinishTimeOut;
        }
    }

    /**
     * check if the player jump is valid (when he click on a link to go to an another page)
     * we ask the wikipedia api to do so
     * @param socket from which the data come from
     * @param url 
     */
    public function validateJump(socket:Socket, url:String) {
        var player = getPlayerFromSocket(socket);
        if (player == null) return;
        if (player.currentPage == url) return;
        var options:HttpsRequestOptions =  {
            hostname: LanguageTools.getURL(language),
            path: "/w/api.php?action=query&prop=links&format=json&formatversion=2&titles=" + player.currentPage + "&pltitles=" + url
        };
        var request = Https.request(options, function (response) {
            response.on('data', function (data) {
                try {
                    var parsed:WikiResponse = Json.parse(data);
                    if (parsed.query.pages[0] == null) {
                        //kick for cheating
                        trace(player.currentPage + " --> " + url);
                        io.emit('message', "it seems that " + player.pseudo + " is cheating! (or the anticheat system is broken)");
                    } else {
                        player.numberOfJump +=1;
                        player.currentPage = url;
                        if (url == endPage) {
                            io.emit('message', player.pseudo + " win the round " + currentRound);
                            loop = null;
                            votePhase();
                        } else {
                            io.emit('message', player.pseudo + " jumped to " + url + ", total jump : " + player.numberOfJump);
                        }              
                    }
                } catch(e:Dynamic) {
                    trace(e);
                }
            });
        });
        request.on('error', function (e) {
            trace(e);
        });
        request.end();
    }

    /**
     * find the player from his socket
     * and assign his vote to the [votingSuggestion] variable of the player
     * PS: we don't verify if the title lead to something, we will in the [selectPage()] method
     * the client also do the verification so they are aware if there title lead to something
     * @param socket from which the data come from
     * @param content the page title we receive
     */
    public function vote(socket:Socket, content:String) {
        var player = getPlayerFromSocket(socket);
        if (player != null) player.votingSuggestion = content;
    }

    /**
     * start the voting phase
     * and call selectPage when the timer run out
     */
    public function votePhase() {
        state = Voting;
        initNewPhase();
        loop = Timer.delay(function () {
            selectPage();
        },currentStateTimeOut()*1000);
    }

    /**
     * randomly pick a start page and a end page from each player vote
     * if an player did not vote, we picked random page to replace his vote
     * if there is only 1 player we picked an another random page
     * start the play phase when the selection is completed
     * PS: NOT OPTIMISED but we do like that so in the future we can do a little drawing animation client side
     */
    public function selectPage() {
        var promiseList = new Array<Promise<Bool>>();
        var urlList = new Array<String>();
        trace("Starting page selection");
        for (i in 0...playerList.length) {
            var title = playerList[i].votingSuggestion;
            if (title != null) {
                title = StringTools.urlEncode(title);
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
                startPage = urlList[randomStart];
                endPage = urlList[randomEnd];
                playPhase();

            }, function(reason) {
                trace("SEVERE something wrong append : " + reason);
        });
    }

    /**
     * set the current page of each player to the starting one who get the picked in the voting phase
     * send the starting and ending page to the client
     * start the playing phase
     * and start the interlude phase when the timer run out
     */
    public function playPhase() {
        for (player in playerList) {
            player.currentPage = startPage;
        }
        io.emit('voteResult', startPage + '?' + endPage);
        state = Playing;
        initNewPhase();
        loop = Timer.delay(function () {
            roundFinishPhase();
        },currentStateTimeOut()*1000);
    }

    /**
     * start the interlude phase between the voting and playing phase
     * and start the voting phase when the timer run out
     */
    public function roundFinishPhase() {
        state = RoundFinish;
        initNewPhase();
        loop = Timer.delay(function () {
            votePhase();
        },currentStateTimeOut()*1000);
    }
    /**
     * refresh the [timeStampBegin] variable
     * and send the state time avaible to the client
     */
    public function initNewPhase() {
        timeStampStateBegin = Timer.stamp();
        io.emit('gameContent', "gameState:" + state +"|" + currentStateTimeOut());
    }

    /**
     * request the wikipedia api and get a random page
     * @param urlList the list on wich we will add the random url if nothing go wrong
     * @param resolve the promise resolve
     * @param reject the promise reject
     */
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

    /**
     * Search a Lobby of type public and add the player to this one, if no lobby is found, it create one.
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
        lobby.giveID();// giveID method also add the lobby to the lobbylist
        lobby.initNamespace();
        lobby.votePhase();
        lobby.addPlayer(player);
        return lobby;
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

}

enum abstract LobbyType(Int) {
    var Public;
    var Private;
}

enum abstract LobbyState(String) from String to String {
    var Voting;
    var Playing;
    var RoundFinish;
    var GameFinish;
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
    var pages:Array<WikiResult>;
}
typedef WikiResult = {
    var ns:Int;
    var title:String;
    var pageid:Int;
    var links:Array<WikiResult>;
}
