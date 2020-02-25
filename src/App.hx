import haxe.Timer;
import js.node.Http;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import async.IO;
import lobby.LobbyPage;
import error.ErrorPage;
import controller.StyleController;
import controller.ConnectController;
import lobby.Lobby;

class App {
    static function main() {
        Lobby.init(); 

        
        var app = Http.createServer(function(im : IncomingMessage, sr : ServerResponse) {
            //IO.init();
            var body = "";
			im.on("data", function(chunk : String) {
                if(body.length > 1e4) {
                    new ErrorPage(im, sr, body, "you are trying to send too much data to the server", 413);
                    im.destroy();
                }
                body += chunk; 
            });
			im.on("end", function() { new App(im, sr, body); });
        });
        app.listen(5000);
        IO.init(app);
        

    }

    function new(im : IncomingMessage, sr : ServerResponse, body : String) {
        var idx : Int = im.url.indexOf("/", 1);
        var route : String = idx == -1 ? im.url : im.url.substring(0, idx);
        Sys.println(route);
        switch (route) { //routage
            case "/": new LobbyPage(im, sr);
            case "/css": new StyleController(im, sr);
            case "/connect": new ConnectController(im, sr, body);
            //case "/play": new GameController(im, sr, body);
            default: new ErrorPage(im, sr, body, "Sorry, you are looking for something that doesn't exist!", 404);
        }
    }

}