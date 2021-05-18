package controller.connect;

import controller.connect.error.ConnectError;
import haxe.Json;
import lobby.Lobby;
import lobby.player.Player;
import js.node.http.ServerResponse;
import js.node.http.IncomingMessage;
import response.SuccessResponse;
import response.connect.ConnectionError;

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
            var lobby:Lobby;
            if (form.lobby != null && form.lobby != "") {
                lobby = Lobby.find(Lobby.decodeID(form.lobby));
            } else lobby = Lobby.joinPublicFree(player, form.gameMode);
            lobby.connect(player);
            var json:ConnectionResponse = {
                status: Success,
                lobbyID: lobby.formatID,
                lobbyType: Public,
                slot: lobby.slot,
                gameMode: lobby.gameLoop.type,
                playerID: player.uuid,
                lang: lobby.language           
            }
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch (e:ConnectError) {
            new ConnectionError(im, sr, e);
        }
    }

}