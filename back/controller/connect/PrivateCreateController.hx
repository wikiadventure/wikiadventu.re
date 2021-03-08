package controller.connect;

import controller.connect.error.ConnectError;
import response.connect.ConnectionError;
import lobby.GameLoop.GameLoopType;
import lobby.gameLoop.Classic;
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
            lobby.connect(player, passwordHash);
            lobby.gameLoop = new Classic(lobby, 5);
            lobby.gameLoop.start();
            var json:ConnectionResponse = {
                status: Success,
                lobbyID: Lobby.encodeID(lobby.id),
                lobbyType: Private,
                gameMode: Classic,
                playerID: player.uuid,
                lang: lobby.language           
            };
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch (e:ConnectError) {
            new ConnectionError(im, sr, e);
        }
    }                   

}