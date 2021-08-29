package controller.websocket;

import lobby.TwitchLobby;
import lobby.Lobby;
import js.node.http.IncomingMessage;

class LobbyController {

    public function new(ws : Ws, im : IncomingMessage, isTwitch:Bool = false) {
        var p =  isTwitch ? 13 : 7;
        var idx = im.url.indexOf("/", p);
        var id = im.url.substring(p, idx);
        var uuid =  im.url.substring(idx+1);
        try {
            var lobby =  isTwitch ? TwitchLobby.find(id) : Lobby.find(Lobby.decodeID(id));
            lobby.onWsAuth(ws, uuid);
        } catch(e:Dynamic) {
            ws.close(1008, 'Connection rejected because the server cannot find the lobby with id ' + id);
        }
        
    }                   

}