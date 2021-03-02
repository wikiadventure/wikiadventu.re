package lobby.player;

import lobby.gameLoop.Phase.PhaseType;
import haxe.Json;
using Lambda;

class PlayersExtension {
    public static function pageHistoryReset(playerList:Array<Player>) {
        for (p in playerList) p.pageListReset();
    }
    public static function voteReset(playerList:Array<Player>) {
        for (p in playerList) p.vote = null;
    }
    public static function emitPlayerJoin(playerList:Array<Player>, player:Player) {
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
        playerList.iter((p) -> 
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

    public static function emitPlayerLeft(playerList:Array<Player>, player:Player) {
        var data:LobbyEvent<PlayerLeft> = {
            type: PlayerLeft,
            data: {
                id: player.id,
            }
        }
        var textData = Json.stringify(data);
        playerList.iter((p) -> if(p.socket != null) p.socket.send(textData));
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
        playerList.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function emitGameState(playerList:Array<Player>, state:Int, currentRound:Int, timeleft:Float) {
        var data:LobbyEvent<GameState> = {
            type: GameState,
            data: {
                phase: state,
                round: currentRound,
                time: timeleft
            }
        }
        var textData = Json.stringify(data);
        playerList.iter((p) -> if(p.socket != null) p.socket.send(textData));
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
        playerList.iter((p) -> if(p.socket != null) p.socket.send(textData));
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
        playerList.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function emitSetOwner(playerList:Array<Player>, ?to:Player) {
        var data:LobbyEvent<SetOwner> = {
            type: SetOwner,
            data: {
                id: playerList[0].id,
            }
        }
        var textData = Json.stringify(data);
        if (to != null && to.socket != null) return to.socket.send(textData);
        playerList.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function emitPath(playerList:Array<Player>, player:Player) {
        var data:LobbyEvent<Path> = {
            type: Path,
            data: {
                id: player.id,
                pages: player.pageList
            }
        }
        var textData = Json.stringify(data);
        playerList.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function emitVoteSkip(playerList:Array<Player>, player:Player) {
        player.voteSkip = !player.voteSkip;
        var data:LobbyEvent<VoteSkip> = {
            type: VoteSkip,
            data: {
                id: player.id,
                state: player.voteSkip
            }
        }
        var textData = Json.stringify(data);
        playerList.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

    public static function resetScore(playerList:Array<Player>) {
        playerList.iter((p) ->  {
            p.score = 0;
            emitUpdateScore(playerList,p);
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