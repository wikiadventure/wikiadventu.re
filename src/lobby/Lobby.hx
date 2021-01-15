package lobby;

import js.node.Querystring;
import fileLog.Log;
import js.node.Timers;
import js.node.Timers.Timeout;
import haxe.Timer;
import haxe.Json;
import js.lib.Promise;
import js.node.Https;
import haxe.io.Bytes;
import config.Lang;
import haxe.crypto.Base64;
import lobby.wikiAPI.WikiRequest;
import lobby.wikiAPI.WikiResponse;
using lobby.player.Player;

class Lobby {
    
    public var type:LobbyType;
    public var state:LobbyState;
    public var timeStampStateBegin:Float;
    public var loop:Timeout;
    public var heartbeat:Timeout;

    public var startPage:String;
    public var endPage:String;
    public var totalPlayer:Int = 0; //use to give an id to player when sending info with socket io

    public var slot:Int;
    public var id:Int;
    public var passwordHash:String;
    public var language:Lang;
    public var playerList:Array<Player>;
    public var owner(get, never):Player;
    public function get_owner() {
        return playerList[0];
    }
    
    public var round:Int;
    public var currentRound:Int;

    public var playTimeOut:Int; //time in second before a round end automatically
    public var voteTimeOut:Int; //time of the Voting state
    public var roundFinishTimeOut:Int = 5; //time between the end of the play state and the begin of the vote state
    public var gameFinishTimeOut:Int = 30;

    public static var lobbyLimit:Int = 10000;
    public static var privateLimit:Int = 200;
    public static var lobbyList:Array<Lobby>;

    /**
     * instanciate the lobby list
     */
    public static function init() {
        lobbyList = new Array<Lobby>();
    }

    public function new(language : Lang, type:LobbyType, ?passwordHash:String, slot:Int=25, round:Int=5, playTimeOut:Int=600, voteTimeOut:Int=30) {
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
        this.passwordHash = passwordHash;
        heartbeat = Timers.setInterval(function() {
            for (p in playerList) {
                if (p.socket != null) {
                    if (p.alive == false) {
                        p.socket.terminate();
                        kickOnTimeout(p);
                    } else {
                        p.alive = false;
                        p.socket.ping();
                    }
                }
            }
        }, 30000);
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
            if (l.id > id) throw "no lobby with id " + id + " found";
            if (l.id == id) return l;
        }
        throw "no lobby with id " + id + " found";
    }


    /**
     * add player to the lobby ( and check if is not already in )
     * @param player to add
     */
    public function addPlayer(player:Player) {
        if (playerList.length >= slot) throw "the lobby is full";
        if (playerList.lastIndexOf(player) == -1) {
            playerList.push(player);
            kickOnTimeout(player);
            log("new player registered : " + player.uuid + " --> " + player.pseudo, PlayerData);
        }
    }

    public function kickOnTimeout(player:Player):Timeout {
        return Timers.setTimeout(function () {
            if (player.socket == null) {
                removePlayer(player);
            }
        },30000);
    }

    public function connect(player:Player, ?passwordHash:String) {
        if (this.type == Public || this.passwordHash == passwordHash) return addPlayer(player);
        log("connection rejected : " + player.uuid + " --> " + player.pseudo + "provide a wrong password", PlayerData);
        throw "Invalid password";
    }
    /**
     * remove a player from the lobby,
     * send the new owner if he get remove
     *  and delete the lobby if it go empty
     * @param player to remove
     */
    public function removePlayer(player:Player) {
        var doOwnerChange = owner == player;
        playerList.remove(player);
        if (doOwnerChange && playerList.length>0) playerList.emitSetOwner();
        log("player left : " + player.uuid + " --> " + player.pseudo, PlayerData);
        if (playerList.length == 0) {
            log("No player left, closing the lobby", Info);
            deleteLobby();
        }
    }

    public function deleteLobby() {
        log("delete the lobby", Info);
        Lobby.lobbyList.remove(this);
    }

    public function getPlayerFromUUID(uuid:String):Player {
        for (p in playerList) {
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
                player.id = totalPlayer;
                totalPlayer++;
                trace(ws.OPEN);
                return onPlayerConnection(player);
            }
            return ws.close(1008, 'Connection rejected because there already a client connected with this playerID');
        }
        return ws.close(1008, 'Connection rejected because playerID is not registered in the lobby');
    }

    public function onPlayerConnection(player:Player) {
        playerList.emitPlayerJoin(player);
        playerList.emitSetOwner(player);
        sendCurrentState(player);
        player.socket.on('message', function (data:String) {
            websocketHandler(player, data);
        });
        player.socket.on('close', function (data) {
            websocketDisconnect(player);
        });
    }

    public function websocketHandler(player:Player, data:String) {
        try {
            var json:WebsocketPackage = tink.Json.parse(data);
            switch json.type {
                case Start:
                    start(player);
                case Message:
                    playerList.emitMessage(player, sanitizeMessage(json.value));
                case Validate:
                    validateJump(player, json.value);
                case Vote:
                    vote(player, json.value);
                case ResetVote:
                    resetVote(player);
            }
        } catch(e:Dynamic) {
            trace(e);
        }
    }

    public function start(player:Player) {
        if (state != Waiting) return log("Game already start --> "  + player.uuid, LogType.Error);
        if (player==owner) {
            votePhase();
        } else {
            log("Someone who is not owner tried to start --> " + player.uuid, LogType.Error);
        }
    }

    public function sanitizeMessage(message:String) {
        return message;
    }

    public function websocketDisconnect(player:Player) {
        player.socket = null;
        kickOnTimeout(player);
        playerList.emitPlayerLeft(player);
    }

    public function sendCurrentState(player:Player) {
        var timeLeft = currentStateTimeOut() - (Timer.stamp() - timeStampStateBegin);
        if (state == Playing) {
            player.currentPage = startPage;
            [player].emitVoteResult(startPage, endPage);
        }
        for (p in playerList) {
            if (p!=player) {
                [player].emitPlayerJoin(p);
            }
        }
        [player].emitGameState(state, currentRound, timeLeft);
    }

    /**
     * get the current state duration
     * @return Int current state duration in seconde
     */
    public function currentStateTimeOut():Int {
        switch state {
            case Waiting:
                return 0;
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

    public function wikiTitleFormat(s:String):String {
        return s;
        
        var regex = ~/["%&'+=?\\^`~]/g;
            var format = regex.map(s, function(r) {
                var match = r.matched(0);
                switch (match) {
                    case "\"":
                        return "%22";
                    case "%":
                        return "%25";
                    case "&":
                        return "%26";
                    case "'":
                        return "%27";
                    case "+":
                        return "%2B";
                    case "=":
                        return "%3D";
                    case "?":
                        return "%3F";
                    case "\\":
                        return "%5C";
                    case "^":
                        return "%5E";
                    case "`":
                        return "%60";
                    case "~":
                        return "%7E";
                    case "_":
                        return " ";
                    default:
                        return '';
                }
            });
        return format;
    }
    /**
     * check if the player jump is valid (when he click on a link to go to an another page)
     * we ask the wikipedia api to do so
     * @param player from which the data come from
     * @param url 
     */
    public function validateJump(player:Player, url:String) {
        if (player.currentPage == url) return;
        var param:WikiRequest = {
            action: "query",
            format: "json",
            titles: player.currentPage,
            generator: "links",
            redirects: 1,
            formatversion: "2",
            gpltitles: url
        };
        var encodedParam = "/w/api.php?" + Querystring.encode(param);
        log(player.pseudo + " validation --> " + encodedParam, PlayerData);
        var oldPage = player.currentPage;
        player.numberOfJump +=1;
        player.currentPage = url;
        var options:HttpsRequestOptions =  {
            hostname: LangTools.getURL(language),
            path: encodedParam,
            method: 'POST',
            headers: {
                "Api-User-Agent":"wiki-adventure/1.1 (https://wiki-adventure.herokuapp.com/; benjamin.gilloury@gmail.com)",
                'Accept': 'application/json',
                'Content-type': "application/x-www-form-urlencoded"
            }  
        };
        var validation:Promise<String>;
        validation = new Promise<String>(
            function(resolve, reject) {
                var request = Https.request(options, function (response) {
                    var body = '';
                    response.on('data', function (chunk) {
                        body = body + chunk;
                    });
                    response.on('end', function () {
                        try {
                            var wiki:WikiResponse = Json.parse(body);
                            if (wiki.query == null) {
                                onCheat(player, url, body, oldPage);
                                reject("player " + player.uuid + " for cheat");
                            } else {
                                resolve(wiki.query.pages[0].title);
                                player.validationBuffer.remove(validation);
                            }
                        } catch(e:Dynamic) {
                            reject("Parsing error during the anti cheat validation --> " + e + " | \n" + encodedParam + " | \n" + body);
                        }
                    });
                });
                request.on('error', function (e) {
                    reject("Wiki request error during the anti cheat validation --> " + e + " | \n" + encodedParam );
                });
                request.end();
            }
        );
        player.validationBuffer.push(validation);
        validation.then(
            function(actualPage) {
                checkWin(player, actualPage);
            },
            function(e:Dynamic) {
                log(e, Error);
            }
        );
        
    }

    public function checkWin(player:Player, actualPage:String) {
        if (Querystring.unescape(actualPage) == endPage) {
            Promise.all(player.validationBuffer).then(
                function(value) {
                    startPage = null;
                    endPage = null;
                    var timeLeft = currentStateTimeOut() - (Timer.stamp() - timeStampStateBegin);
                    player.score += 500 + Std.int(timeLeft);
                    log("updateScore --> " +  player.id + "(" + player.pseudo + ") :" + player.score, PlayerData);
                    log("WinRound --> " +  player.id + "(" + player.pseudo + ")", PlayerData);
                    playerList.emitUpdateScore(player);
                    playerList.emitWinRound(player);
                    roundFinishPhase();
                }, function(reason) {
                    log("player " + player.uuid + " cheat on final validation : ", PlayerData);     
            }).catchError(
                function(error) {
                    log(error,Error);
                }
            );
        } 
    }

    public function onCheat(player:Player, url:String, body:String, oldPage:String) {
        log(body, PlayerData);
        log(player.pseudo + " is cheating!", PlayerData);
        log(oldPage + " --> " + url, PlayerData);
        playerList.emitMessage("it seems that " + player.pseudo + " is cheating! (or the anticheat system is broken)");
        playerList.emitMessage(player.pseudo + "jump from " + player.currentPage + " to " + StringTools.urlDecode(url));
    }

    /**
     * find the player from his socket
     * and assign his vote to the [vote] variable of the player
     * PS: we don't verify if the title lead to something, we will in the [selectPage()] method
     * the client also do the verification so they are aware if there title lead to something
     * @param player from which the data come from
     * @param content the page title we receive
     */
    public function vote(player:Player, content:String) {
        log("player vote : " + player.uuid + " --> " + player.pseudo + " | " + content, PlayerData);
        player.vote = content;
    }

    public function resetVote(player:Player) {
        player.vote = null;
    }

    /**
     * randomly pick a start page and a end page from each player vote
     * if an player did not vote, we picked random page to replace his vote
     * if there is only 1 player we picked an another random page
     * start the play phase when the selection is completed
     * TODO : pick a random page if start and end page are the same
     * PS: NOT OPTIMISED but we do like that so in the future we can do a little drawing animation client side
     */
    public function selectPage(suggestionList:Array<String>) {
        var promiseList = new Array<Promise<Bool>>();
        var urlList = new Array<String>();
        log("Starting page selection", Info);
        for (i in 0...suggestionList.length) {
            var title = suggestionList[i];
            if (title != null) {
                var promise = new Promise<Bool>(
                    function (resolve, reject) {
                        var param:WikiRequest = {
                            action: "query",
                            format: "json",
                            formatversion: "2",
                            list: "search",
                            srlimit: 1,
                            srnamespace: 0,
                            srsearch: "intitle:"+title,
                            srprop: ""
                        };
                        var encodedParam = "/w/api.php?" + Querystring.encode(param);
                        var options:HttpsRequestOptions =  {
                            hostname: LangTools.getURL(language),
                            path: encodedParam,
                            method: 'POST',
                            headers: {
                                "Api-User-Agent":"wiki-adventure/1.1 (https://wiki-adventure.herokuapp.com/; benjamin.gilloury@gmail.com)",
                                'Accept': 'application/json',
                                'Content-type': "application/x-www-form-urlencoded"
                            } 
                        };
                        var request = Https.request(options, function (response) {
                            response.on('data', function (data) {
                                try {
                                    var parsed:WikiResponse = Json.parse(data);
                                    if (parsed.query.searchinfo.totalhits == 0) {
                                        getRandomURL(urlList, resolve, reject);
                                    } else {
                                        urlList.push(parsed.query.search[0].title);
                                        resolve(true);
                                    }
                                } catch(e:Dynamic) {
                                    reject("SEVERE server Error : " + e);
                                }
                            });
                        });
                        request.on('error', function (e) {
                            log("page selection : " + e, Error);
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
        if (suggestionList.length < 2) {
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
                startPage = urlList[randomStart];
                urlList.remove(startPage);
                var randomEnd:Int;
                do {
                    randomEnd = Std.random(urlList.length);
                    endPage = urlList[randomEnd];
                    urlList.remove(endPage);
                } while (endPage == startPage && urlList.length > 0);
                if (endPage == startPage) {
                    var promise = new Promise<Bool>(
                        function (resolve, reject) {
                            getRandomURL(urlList, resolve, reject);
                        }
                    ).then(function(value) {
                        startPage = urlList[0];
                        onSelectPageFinish();
                    });
                } else {
                    onSelectPageFinish();
                }
            }, function(reason) {
                log("SEVERE something wrong append during page selection : " + reason, Error);
        });
    }

    public function onSelectPageFinish() {
        log("Start page : " + startPage, Info);
        log("End page : " + endPage, Info);
        playPhase();
    }

    /**
     * start the voting phase
     * and call selectPage when the timer run out
     */
     public function waitPhase() {
        if(playerList.length == 0) return;
        state = Waiting;
        initNewPhase();
        playerList.emitSetOwner();
    }
    /**
     * start the voting phase
     * and call selectPage when the timer run out
     */
     public function votePhase() {
        if(playerList.length == 0) return;
        state = Voting;
        for (player in playerList) {
            player.vote = null;
        }
        initNewPhase();
        loop = Timers.setTimeout(function () {
            var suggestionList = new Array<String>();
            for (player in playerList) {
                suggestionList.push(player.vote);
            }
            selectPage(suggestionList);
        },currentStateTimeOut()*1000);
    }


    /**
     * set the current page of each player to the starting one who get the picked in the voting phase
     * send the starting and ending page to the client
     * start the playing phase
     * and start the interlude phase when the timer run out
     */
    public function playPhase() {
        if (playerList.length == 0) return;
        for (player in playerList) {
            player.currentPage = startPage;
        }
        playerList.emitVoteResult(startPage, endPage);
        state = Playing;
        initNewPhase();
        loop = Timers.setTimeout(function () {
            playPhaseEnd();
        },currentStateTimeOut()*1000);
    }

    public function playPhaseEnd() {
        for (player in playerList) {
            player.vote = null;
        }
        roundFinishPhase();
    }

    public function gameFinishPhase() {
        if (playerList.length == 0) return;
        currentRound = 1;
        state = GameFinish;
        initNewPhase();
        loop = Timers.setTimeout(function () {
            if (type == Public) {
                votePhase();
            } else {
                waitPhase();
            }
        },currentStateTimeOut()*1000);

    }

    /**
     * start the interlude phase between the voting and playing phase
     * and start the voting phase when the timer run out
     */
    public function roundFinishPhase() {
        if (state == RoundFinish) return;
        if (playerList.length == 0) return;
        Timers.clearTimeout(loop);
        state = RoundFinish;
        initNewPhase();
        currentRound++;
        loop = Timers.setTimeout(function () {        
            if (currentRound > round) {
                gameFinishPhase();
                return;
            }
            votePhase();
        },currentStateTimeOut()*1000);
    }
    /**
     * refresh the [timeStampBegin] variable
     * and send the state time to the client
     */
    public function initNewPhase() {
        Timers.clearTimeout(loop);
        timeStampStateBegin = Timer.stamp();
        playerList.emitGameState(state, currentRound, currentStateTimeOut());
        log("New phase init : " + state +"|" + currentRound + "|" + currentStateTimeOut(), Info);
    }

    /**
     * request the wikipedia api and get a random page
     * @param urlList the list on wich we will add the random url if nothing go wrong
     * @param resolve the promise resolve
     * @param reject the promise reject
     */
    public function getRandomURL(urlList:Array<String>, resolve:(value:Bool) -> Void, reject:(reason:Dynamic) -> Void) {
        var param:WikiRequest = {
            action: "query",
            format: "json",
            formatversion: "2",
            list: "random",
            rnnamespace: 0,
            rnlimit: 1,
        };
        var encodedParam = "/w/api.php?" + Querystring.encode(param);
        var options:HttpsRequestOptions =  {
            hostname: LangTools.getURL(language),
            path: encodedParam,
            method: 'POST',
            headers: {
                "Api-User-Agent":"wiki-adventure/1.1 (https://wiki-adventure.herokuapp.com/; benjamin.gilloury@gmail.com)",
                'Accept': 'application/json',
                'Content-type': "application/x-www-form-urlencoded"
            } 
        };
        var request = Https.request(options, function (response) {
            response.on('data', function (data) {
                try {
                    var parsed:WikiResponse = Json.parse(data);
                    urlList.push(parsed.query.random[0].title);
                    log("success : random page " + parsed.query.random[0].title, Info);
                    resolve(true);

                } catch(e:Dynamic) {
                    log("random page request fail : " + e, Error);
                    reject("SEVERE server Error : " + e);
                }   
            });
        });
        request.on('error', function (e) {
            log("Wiki request error : " + e, Error);
        });
        request.end();

    }
    public var encodedID(get, never):String;
    /**
     * get the lobbyId to string
     * @return Int
     */
     public function get_encodedID():String {
        return Lobby.encodeID(id);
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
                    l.connect(player);
                    return l;
                }
            }
        }
        // if no free slot are find create a new public lobby
        var lobby = new Lobby(player.language, Public);
        lobby.giveID();// giveID method also add the lobby to the lobbylist
        lobby.connect(player);
        lobby.votePhase();
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
    public function log( data : Dynamic, logType:LogType, ?pos : haxe.PosInfos ) {
        var time = "[" + Date.now().toString() + "]";
		pos.fileName = time + " lobby " + Lobby.encodeID(id) + " " + logType + " -> " + pos.fileName;
        haxe.Log.trace(data, pos);
        var fileName = "lobby/" + Lobby.encodeID(id) + "/" + logType + ".log";
        var content = haxe.Log.formatOutput(data, pos);
        fileLog.Log.inFile(fileName, content);
	}

}

typedef WebsocketPackage = {
    type:WebsocketPackageType,
    ?value:String
}
enum abstract WebsocketPackageType(String) {
    var Start;
    var Message;
    var Vote;
    var ResetVote;
    var Validate;
}

enum abstract LogType(String) {
    var PlayerData;
    var Warning;
    var Error;
    var Info;
}

enum abstract LobbyType(String) {
    var Public;
    var Private;
    var Twitch;
}

enum abstract LobbyState(String) {
    var Waiting;
    var Voting;
    var Playing;
    var RoundFinish;
    var GameFinish;
}
