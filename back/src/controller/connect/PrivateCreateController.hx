package controller.connect;

import response.connect.ConnectionError;
import response.SuccessResponse;
import haxe.crypto.Sha256;
import lobby.Lobby;
import lobby.player.Player;
import js.node.http.ServerResponse;
import js.node.http.IncomingMessage;
import haxe.Json;

using lobby.GameLoop;

class PrivateCreateController {
    
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
            var player = new Player(form.pseudo,form.lang);
            var passwordHash = Sha256.encode(form.password);
            var lobby = new Lobby(player.lang, Private, passwordHash, form.slot);
            lobby.connect(player, passwordHash);
            lobby.select(form.gameLoop, form.config);
            lobby.gameLoop.start();
            var json:ConnectResponse = {
                lobbyID: lobby.formatId,
                lobbyType: Private,
                slot: lobby.slot,
                gameLoop: lobby.gameLoop.type,
                playerID: player.uuid,
                lang: lobby.lang           
            };
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch (e:ConnectError) {
            new ConnectionError(im, sr, e);
        }
    }                   

}