package controller.connect;

import response.SuccessResponse;
import haxe.crypto.Sha256;
import error.ErrorPage;
import lobby.Lobby;
import lobby.player.Player;
import js.node.http.ServerResponse;
import js.node.http.IncomingMessage;
import haxe.Json;

class PrivateCreateController {
    
    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    var form : ConnectionRequest;

    public function new(im : IncomingMessage, sr : ServerResponse, body : String, form : ConnectionRequest) {
        this.im = im;
        this.sr = sr;
        this.body = body;
        this.form = form;
        var player = new Player(form.pseudo,form.lang);
        var passwordHash = Sha256.encode(form.password);
        try {
            var lobby = new Lobby(player.language, Private, passwordHash);
            lobby.giveID();// giveID method also add the lobby to the lobbylist
            lobby.initNamespace();
            lobby.connect(player, passwordHash);
            lobby.votePhase();
            var json:ConnectionResponse = {
                status: Success,
                lobbyID: Lobby.encodeID(lobby.id),
                lobbyType: Private,
                playerID: player.uuid,
                lang: lobby.language           
            };
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch (e:Dynamic) {
            new ErrorPage(im, sr, body, "internal error : "+e,400);
        }
    }                   

}