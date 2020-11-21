package lobby.player;

import js.lib.Promise;
import lobby.Lobby.LobbyState;
import config.Lang;
import config.randomName.EnglishNameGenerator;
import uuid.Uuid;
import haxe.Json;
using Lambda;

class Player {
    public var socket:Ws;
    public var pseudo:String;
    public var uuid:String;//for authentification
    public var language:Lang;
    public var score:Int=0;
    public var numberOfJump:Int=0;
    public var currentPage:String;
    public var validationBuffer:Array<Promise<Bool>>;
    public var votingSuggestion:String;
    public var id:Int;//for client identification
    public var alive:Bool;

    public function new(pseudo:String, language:Lang) {
        this.language = language;
        this.uuid = Uuid.v4();
        validationBuffer = [];
        var dangerRegex : EReg =  ~/[<>:|%$\/\\]/g;
        if ( pseudo == null || pseudo == "" || pseudo.length < 3 || pseudo.length > 26 || dangerRegex.match(pseudo) ) {
            this.pseudo = randomNameGenerator(this.language);
        } else {
            this.pseudo = pseudo;
        }
    }

    public function assignSocket(socket:Ws):Bool {
        if (this.socket != null) {
            return false;
        }
        this.socket = socket;
        this.socket.on('pong', function() {
            alive = true;
        });
        alive = true;
        return true;
    }

    //suggest your own language random name generator
    public static function randomNameGenerator(l:Lang):String {
        switch l {
            case en: return EnglishNameGenerator.getInstance().getRandomName();
            case fr: return "anonymous";
            case de: return "anonymous";
            case es: return "anonymous";
            case it: return "anonymous";
            case eo: return "anonymous";
            case pt: return "anonymous";
        }
    }

    public static function emitPlayerJoin(playerList:Array<Player>, player:Player) {
        var data:LobbyEvent<PlayerJoin> = {
            type: PlayerJoin,
            data: {
                id: player.id,
                pseudo: player.pseudo,
                self: false,
                score: player.score
            }
        }
        var textData = Json.stringify(data);
        for (p in playerList) {
            if (p.socket != null) {
                if (p != player) {
                    p.socket.send(textData);
                } else {
                    data.data.self = true;
                    var text = Json.stringify(data);
                    p.socket.send(text);
                }
            }
        }
    }
    public static function emitPlayerLeft(playerList:Array<Player>, player:Player) {
        var data:LobbyEvent<PlayerLeft> = {
            type: PlayerLeft,
            data: {
                id: player.id,
            }
        }
        var textData = Json.stringify(data);
        for (p in playerList) {
            if (p.socket != null) {
                p.socket.send(textData);
            }
        }
    }
    public static function emitVoteResult(playerList:Array<Player>, startPage:String, endPage:String) {
        var data:LobbyEvent<VoteResult> = {
            type: VoteResult,
            data: {
                start: startPage,
                end: endPage
            }
        }
        var textData = Json.stringify(data);
        for (p in playerList) {
            if (p.socket != null) {
                p.socket.send(textData);
            }
        }
    }
    public static function emitGameState(playerList:Array<Player>, state:LobbyState, currentRound:Int, timeleft:Float) {
        var data:LobbyEvent<GameState> = {
            type: GameState,
            data: {
                state: state,
                round: currentRound,
                time: timeleft
            }
        }
        var textData = Json.stringify(data);
        for (p in playerList) {
            if (p.socket != null) {
                p.socket.send(textData);
            }
        }
    }
    public static function emitUpdateScore(playerList:Array<Player>, player:Player) {
        var data:LobbyEvent<UpdateScore> = {
            type: UpdateScore,
            data: {
                id: player.id,
                score: player.score
            }
        }
        var textData = Json.stringify(data);
        for (p in playerList) {
            if (p.socket != null) {
                p.socket.send(textData);
            }
        }
    }
    public static function emitWinRound(playerList:Array<Player>, player:Player) {
        var data:LobbyEvent<WinRound> = {
            type: WinRound,
            data: {
                id: player.id
            }
        }
        var textData = Json.stringify(data);
        for (p in playerList) {
            if (p.socket != null) {
                p.socket.send(textData);
            }
        }
    }
    public static function emitMessage(playerList:Array<Player>, ?player:Player, message:String) {
        var data:LobbyEvent<Message> = {
            type: Message,
            data: {
                id: player == null ? -1 : player.id,
                mes: message
            }
        }
        var textData = Json.stringify(data);
        for (p in playerList) {
            if (p.socket != null) {
                p.socket.send(textData);
            }
        }
    }

}

enum abstract LobbyEventType(String) {
    var PlayerJoin;
    var PlayerLeft;
    var VoteResult;
    var GameState;
    var UpdateScore;
    var WinRound;
    var Message;
}

typedef LobbyEvent<T> = {
    type:LobbyEventType,
    data:T
}
typedef PlayerJoin = {
    pseudo:String,
    id:Int,
    score:Int,
    self:Bool
}
typedef PlayerLeft = {
    id:Int
}
typedef VoteResult = {
    start:String,
    end:String
}
typedef GameState = {
    state:LobbyState,
    round:Int,
    time:Float
}
typedef UpdateScore = {
    id:Int,
    score:Int
}
typedef WinRound = {
    id:Int
}
typedef Message = {
    id:Int,
    mes:String
}
