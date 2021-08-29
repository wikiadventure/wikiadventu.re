package lobby.gameLoop.phase;

import lobby.packet.handler.vanilla.Validate.InternalValidationSucessPacket;
import lobby.packet.PacketEventSubscriber;
import lobby.gameLoop.Phase.VanillaPhaseType;
import haxe.Timer;
import js.node.Querystring;
import js.lib.Promise;
import lobby.player.Player;
using utils.ReverseArrayIterator;
using lobby.player.PlayersExtension;
using lobby.packet.emitter.vanilla.VoteResult.VoteResultEmitter;
using lobby.packet.emitter.vanilla.WinRound.WinRoundEmitter;
using lobby.packet.emitter.vanilla.Path.PathEmitter;
using lobby.packet.emitter.vanilla.UpdateScore.UpdateScoreEmitter;
using Lambda;

class Playing extends Phase {

    public var startPage:String;
    public var endPage:String;
    public var hasWinner:Bool = false;
    public var unsubscribes:Array<()->Void> = [];
    
    public override function onStart() {
        lobby.players.pageHistoryReset();
        lobby.players.setStartPage(startPage);
        lobby.players.emitVoteResult(startPage, endPage);
    }

    public override function onEnd() {
        if (!hasWinner) lobby.players.emitWinRound(null);
        unsubscribes.iter(f->f());
    }

    public function checkWin(lobby:Lobby, player:Player, p:Any) {
        var v:InternalValidationSucessPacket = cast p;
        if (Querystring.unescape(v.page) == endPage)
            Promise.all(player.validationBuffer).then(
                v -> {
                    if (player.validationList.reversedIterable().find((v) -> v.page == endPage && v.validated) == null) {
                        log("player " + player.uuid + " cheat on final validation : ", PlayerData);
                        return;
                    }
                    win(player);
                }
            ).catchError(
                reason -> log("player " + player.uuid + " cheat on final validation : ", PlayerData)
            );
    }

    public function win(player:Player) {
        if (lobby.gameLoop.currentPhase.type != VanillaPhaseType.Playing) return;
        var timeLeft = duration - (Timer.stamp() - lobby.gameLoop.timeStampStateBegin);
        player.score += 500 + Std.int(timeLeft*0.5);
        log("updateScore --> " +  player.id + "(" + player.pseudo + ") :" + player.score, PlayerData);
        log("WinRound --> " +  player.id + "(" + player.pseudo + ")", PlayerData);
        lobby.players.emitUpdateScore(player);
        lobby.players.emitWinRound(player);
        lobby.players.emitPath(player, duration - timeLeft);
        hasWinner = true;
        end();
    }

    public function onCheat(player:Player, oldPage:String, newPage:String, url:String, body:String) {
        /*log(body, PlayerData);
        log(player.pseudo + " is cheating!", PlayerData);
        log(oldPage + " --> " + url, PlayerData);
        log(player.validationList, PlayerData);
        lobby.players.emitMessage("Unvalidated jump from " + player.pseudo + " ! 
        He might have tried to cheat!");
        lobby.players.emitMessage(player.pseudo + "jump from " + player.currentPage + " to " + newPage);*/
        
    }

    public function onWikiError(player:Player, oldPage:String, newPage:String, url:String, body:String) {
        /*log(body, Error);
        log(player.pseudo + " WikiError on url: " + url, Error);
        lobby.players.emitMessage("Wiki verification error " + player.pseudo);
        lobby.players.emitMessage(player.pseudo + "jump from " + player.currentPage + " to " + StringTools.urlDecode(url));*/
    }

    public function onRequestFailed(player:Player, oldPage:String, newPage:String, url:String, error:String) {
        /*log(error, Error);
        log(player.pseudo + " Request fail on url: " + url, Error);
        lobby.players.emitMessage("Server verification error for " + player.pseudo);*/
    }

    public override function sendCurrentState(player:Player) {
        player.currentPage = startPage;
        [player].emitVoteResult(startPage, endPage);
    }
    
    public function new(start:String, end:String, lobby:Lobby, duration:Int = 600) {
        super(lobby, duration);
        type = VanillaPhaseType.Playing;
        startPage = start;
        endPage = end;
        PacketEventSubscriber.subscribe(lobby, InternalPacketType.ValidationSucess, checkWin);
    }


}