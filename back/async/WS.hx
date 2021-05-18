package async;

import js.node.http.IncomingMessage;
import haxe.extern.EitherType;
import ws.Server;
import controller.websocket.LobbyController;


class WS {
    
    public static var server:Server;

    public static function init(app:EitherType<js.node.http.Server, js.node.https.Server>) {

        server = new Server({server: app});
        server.on('connection', onConnection);
        
    }
    static function onConnection(ws:Ws, im:IncomingMessage) {
        var idx = im.url.indexOf("/", 1);
        var route : String = idx == -1 ? im.url : im.url.substring(0, idx);
        switch route {
            case "/lobby":
                new LobbyController(ws, im);
            case "/twitchLobby":
                new LobbyController(ws, im, true);
            default:
                ws.close(1008, "invalid connexion route");
                
        }
    }

}