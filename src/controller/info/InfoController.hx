package controller.info;

import haxe.Json;
import response.SuccessResponse;
import lobby.Lobby;
import js.node.http.ServerResponse;
import js.node.http.IncomingMessage;

class InfoController {
    
    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
   

    public function new(im : IncomingMessage, sr : ServerResponse) {
        this.im = im;
        this.sr = sr;
        var lobbyID = im.url.substring(10);
        try {
            var lobby = Lobby.find(Lobby.decodeID(lobbyID));
            var json:InfoResponse = {
                status: Found,
                lobbyID: Lobby.encodeID(lobby.id),
                lobbyType: lobby.type,
                lobbyLang: lobby.language,
                slot: lobby.slot,
                players: lobby.playerList.length,
                state: lobby.state

            };
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch(e:Dynamic) {
            var json:InfoResponse = {
                status: NotFound,
                error: e

            };
            new SuccessResponse(im, sr, Json.stringify(json));
        }
        
    }

}