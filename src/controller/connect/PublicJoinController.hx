package controller.connect;

import haxe.Json;
import error.ErrorPage;
import lobby.Lobby;
import lobby.player.Player;
import js.node.http.ServerResponse;
import js.node.http.IncomingMessage;
import response.SuccessResponse;

class PublicJoinController {
    
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
        try {
            var lobby = Lobby.joinPublicFree(player);
            var json:ConnectionResponse = {
                status: Success,
                lobbyID: Lobby.encodeID(lobby.id),
                playerID: player.uuid,
                lang: lobby.language           
            }
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch (e:Dynamic) {
            new ErrorPage(im, sr, body, "server full"+e,400);
            
        }
    }

}