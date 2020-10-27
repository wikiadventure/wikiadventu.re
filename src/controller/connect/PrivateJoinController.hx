package controller.connect;

import haxe.Json;
import response.SuccessResponse;
import haxe.crypto.Sha256;
import error.ErrorPage;
import lobby.Lobby;
import lobby.player.Player;
import js.node.http.ServerResponse;
import js.node.http.IncomingMessage;

class PrivateJoinController {
    
    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    var form : ConnectionRequest;

    public function new(im : IncomingMessage, sr : ServerResponse, body : String, form : ConnectionRequest) {
        this.im = im;
        this.sr = sr;
        this.body = body;
        this.form = form;
        var player = new Player(form.pseudo, form.lang);
        var passwordHash = Sha256.encode(form.password);
        try {
            var lobby = Lobby.find(Lobby.decodeID(form.lobby));
            lobby.connect(player, passwordHash);
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