package controller.connect;

import response.connect.ConnectionError;
import haxe.Json;
import response.SuccessResponse;
import haxe.crypto.Sha256;
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
                lobbyID: lobby.formatID,
                lobbyType: Private,
                slot: lobby.slot,
                gameMode: lobby.gameLoop.type,
                playerID: player.uuid,
                lang: lobby.language
            };
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch (e:ConnectError) {
            new ConnectionError(im, sr, e);
        }
    }

}