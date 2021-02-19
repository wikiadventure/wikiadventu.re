package lobby.gameLoop.phase;

import haxe.Timer;
import js.node.Querystring;
import js.lib.Promise;
import lobby.wikiAPI.WikiTools;
import lobby.Lobby.WebsocketPackage;
import lobby.Lobby.WebsocketPackageType;
import lobby.gameLoop.Phase.PhaseType;
import lobby.player.Player;
using lobby.player.PlayersExtension;

class Playing extends Phase {

    public var startPage:String;
    public var endPage:String;
    
    public override function onStart() {
        lobby.playerList.emitVoteResult(startPage, endPage);
    }

    public override function onEnd() {
        
    }

    public override function controller(player:Player, json:WebsocketPackage) {
        switch json.type {
            case Validate:
                validate(player, json);
            default:
        }
    }

    public function validate(player:Player, json:WebsocketPackage) {
        var oldPage = player.currentPage;
        player.numberOfJump +=1;
        player.currentPage = json.value;
        var validation:Promise<String>;
        validation = WikiTools.validateJump(lobby.language, player.currentPage, json.value);
        validation.then(
            (landPage) -> {
                player.validationBuffer.remove(validation);
            }
        ).catchError(
            (reason) -> {
                switch reason.type {
                    case Cheat:
                        onCheat(player, oldPage, json.value, reason.url, reason.body);
                    case WikiError:
                        onWikiError(player, oldPage, json.value, reason.url, reason.body);
                    case RequestFailed:
                        onRequestFailed(player, oldPage, json.value, reason.url, reason.e);
                    default:
                        
                }
            }
        );
        validation.then(
            (actualPage) -> checkWin(player, actualPage),
            (e) -> log(e, Error)
        );
    }

    public function checkWin(player:Player, actualPage:String) {
        if (Querystring.unescape(actualPage) == endPage)
            Promise.all(player.validationBuffer).then(
                (v) -> win(player),
                (reason) -> log("player " + player.uuid + " cheat on final validation : ", PlayerData)
            ); 
    }

    public function win(player:Player) {
        var timeLeft = duration - (Timer.stamp() - lobby.gameLoop.timeStampStateBegin);
        player.score += 500 + Std.int(timeLeft*0.5);
        log("updateScore --> " +  player.id + "(" + player.pseudo + ") :" + player.score, PlayerData);
        log("WinRound --> " +  player.id + "(" + player.pseudo + ")", PlayerData);
        lobby.playerList.emitUpdateScore(player);
        lobby.playerList.emitWinRound(player);
        lobby.playerList.emitPath(player);
        end();
    }

    public function onCheat(player:Player, oldPage:String, newPage:String, url:String, body:String) {
        log(body, PlayerData);
        log(player.pseudo + " is cheating!", PlayerData);
        log(oldPage + " --> " + url, PlayerData);
        log(player.pageList, PlayerData);
        lobby.playerList.emitMessage("it seems that " + player.pseudo + " is cheating! (or the anticheat system is broken)");
        lobby.playerList.emitMessage(player.pseudo + "jump from " + player.currentPage + " to " + StringTools.urlDecode(url));
    }

    public function onWikiError(player:Player, oldPage:String, newPage:String, url:String, body:String) {
        log(body, Error);
        log(player.pseudo + " WikiError on url: " + url, Error);
        lobby.playerList.emitMessage("Wiki verification error " + player.pseudo);
        lobby.playerList.emitMessage(player.pseudo + "jump from " + player.currentPage + " to " + StringTools.urlDecode(url));
    }

    public function onRequestFailed(player:Player, oldPage:String, newPage:String, url:String, error:String) {
        log(error, Error);
        log(player.pseudo + " Request fail on url: " + url, Error);
        lobby.playerList.emitMessage("Server verification error for " + player.pseudo);
    }
    
    public function new(start:String, end:String, lobby:Lobby, duration:Int = 600) {
        super(lobby, duration);
        type = Playing;
        startPage = start;
        endPage = end;
    }


}