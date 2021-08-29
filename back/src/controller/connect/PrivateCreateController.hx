package controller.connect;

import lobby.GameLoop;
import response.connect.ConnectionError;
import response.SuccessResponse;
import haxe.crypto.Sha256;
import lobby.Lobby;
import lobby.player.Player;
import js.node.http.ServerResponse;
import js.node.http.IncomingMessage;
import haxe.Json;

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
            var lobby = new Lobby(player.language, Private, passwordHash, form.slot);
            lobby.giveID();// giveID method also add the lobby to the lobbylist
            lobby.connect(player, passwordHash);
            lobby.gameLoop = GameLoop.select(form.gameLoop, lobby);
            lobby.gameLoop.start();
            var json:ConnectResponse = {
                lobbyID: lobby.formatID,
                lobbyType: Private,
                slot: lobby.slot,
                gameLoop: lobby.gameLoop.type,
                playerID: player.uuid,
                lang: lobby.language           
            };
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch (e:ConnectError) {
            new ConnectionError(im, sr, e);
        }
    }                   

}