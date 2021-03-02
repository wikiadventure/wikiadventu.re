package lobby.player;

import lobby.gameLoop.Phase.PhaseType;
import haxe.Json;
using Lambda;

class PlayersExtension {
    public static function pageHistoryReset(players:Array<Player>) {
        players.iter(p -> p.pageListReset());
    }
    public static function voteReset(players:Array<Player>) {
        players.iter(p -> p.vote = null);
    }
    public static function setStartPage(players:Array<Player>, startPage:String) {
        players.iter(p -> p.currentPage = startPage);
    }
    public static function emitPlayerJoin(players:Array<Player>, player:Player) {
        var data:LobbyEvent<PlayerJoin> = {
            type: PlayerJoin,
            data: {
                id: player.id,
                pseudo: player.pseudo,
                self: false,
                score: player.score,
                voteSkip: player.voteSkip
            }
        }
        var textData = Json.stringify(data);
        players.iter((p) -> 
            if(p.socket != null) {
                if (p != player) p.socket.send(textData);
                else {
                    data.data.self = true;
                    var text = Json.stringify(data);
                    p.socket.send(text);
                }
            }
        );
    }

    public static function emitPlayerLeft(players:Array<Player>, player:Player) {
        var data:LobbyEvent<PlayerLeft> = {
            type: PlayerLeft,
            data: {
                id: player.id,
            }
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function emitVoteResult(players:Array<Player>, startPage:String, endPage:String) {
        var data:LobbyEvent<VoteResult> = {
            type: VoteResult,
            data: {
                start: startPage,
                end: endPage
            }
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function emitGameState(players:Array<Player>, state:Int, currentRound:Int, timeleft:Float) {
        var data:LobbyEvent<GameState> = {
            type: GameState,
            data: {
                phase: state,
                round: currentRound,
                time: timeleft
            }
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function emitUpdateScore(players:Array<Player>, player:Player) {
        var data:LobbyEvent<UpdateScore> = {
            type: UpdateScore,
            data: {
                id: player.id,
                score: player.score
            }
        }
        var textData = Json.stringify(data);
        for (p in players) {
            if (p.socket != null) {
                p.socket.send(textData);
            }
        }
    }

    public static function emitWinRound(players:Array<Player>, player:Player) {
        var data:LobbyEvent<WinRound> = {
            type: WinRound,
            data: {
                id: player.id
            }
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function emitMessage(players:Array<Player>, ?player:Player, message:String) {
        var data:LobbyEvent<Message> = {
            type: Message,
            data: {
                id: player == null ? -1 : player.id,
                mes: message
            }
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function emitSetOwner(players:Array<Player>, ?to:Player) {
        var data:LobbyEvent<SetOwner> = {
            type: SetOwner,
            data: {
                id: players[0].id,
            }
        }
        var textData = Json.stringify(data);
        if (to != null && to.socket != null) return to.socket.send(textData);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function emitPath(players:Array<Player>, player:Player) {
        var data:LobbyEvent<Path> = {
            type: Path,
            data: {
                id: player.id,
                pages: player.pageList
            }
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function emitVoteSkip(players:Array<Player>, player:Player) {
        player.voteSkip = !player.voteSkip;
        var data:LobbyEvent<VoteSkip> = {
            type: VoteSkip,
            data: {
                id: player.id,
                state: player.voteSkip
            }
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function resetScore(players:Array<Player>) {
        players.iter((p) ->  {
            p.score = 0;
            emitUpdateScore(players,p);
        });
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
    var SetOwner;
    var Path;
    var VoteSkip;
}

typedef LobbyEvent<T> = {
    type:LobbyEventType,
    data:T
}

typedef PlayerJoin = {
    pseudo:String,
    id:Int,
    score:Int,
    voteSkip:Bool,
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
    phase:Int,
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

typedef SetOwner = {
    id:Int
}

typedef Path = {
    id:Int,
    pages:Array<String>
}

typedef VoteSkip = {
    id:Int,
    state:Bool
}