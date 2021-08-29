package controller.connect;

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
    var form : ConnectRequest;

    public function new(im : IncomingMessage, sr : ServerResponse, body : String, form : ConnectRequest) {
        this.im = im;
        this.sr = sr;
        this.body = body;
        this.form = form;
        try {
            var player = new Player(form.pseudo, form.lang);
            var lobby:Lobby;
            if (form.lobby != null && form.lobby != "") {
                lobby = Lobby.find(Lobby.decodeID(form.lobby));
            } else lobby = Lobby.joinPublicFree(player, form.gameLoop);
            lobby.connect(player);
            var json:ConnectResponse = {
                lobbyID: lobby.formatID,
                lobbyType: Public,
                slot: lobby.slot,
                gameLoop: lobby.gameLoop.type,
                playerID: player.uuid,
                lang: lobby.language           
            }
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch (e:ConnectError) {
            new ConnectionError(im, sr, e);
        }
    }

}