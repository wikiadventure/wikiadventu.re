package controller.websocket;

import lobby.Lobby;
import js.node.http.IncomingMessage;

class LobbyController {
    
    var ws : Ws;
    var im : IncomingMessage;

    public function new(ws : Ws, im : IncomingMessage) {
        var idx = im.url.indexOf("/", 7);
        var id = im.url.substring(7, idx);
        var uuid =  im.url.substring(idx+1);
        trace(id);
        trace(uuid);
        try {
            var lobby = Lobby.find(Lobby.decodeID(id));
            lobby.onWsAuth(ws, uuid);
        } catch(e:Dynamic) {
            ws.close(1008, 'Connection rejected because the server cannot find the lobby with id ' + id);
        }
        
    }                   

}