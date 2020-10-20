import lobby.player.Player;
import lobby.TwitchLobby;
import config.twitch.TwitchCredential;
import controller.FrontController;
import js.node.Http;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import async.WS;
import error.ErrorPage;
import controller.connect.ConnectController;
import controller.connect.twitch.TwitchController;
import lobby.Lobby;
import js.Node.process;
#if https
import js.node.Https;
#end

class App {

    static function main() {
        trace("server start");
        trace("test");
        Lobby.init();
        TwitchLobby.init();

        #if https
            var options = {
                key: Fs.readFileSync('config/ssl/key.pem', 'utf8'),
                cert: Fs.readFileSync('config/ssl/cert.pem', 'utf8')
            };
            var server = Https.createServer(options, handle);
        #else
            var server = Http.createServer(handle);
        #end
        TwitchCredential.init();
        server.listen(process.env['PORT']);
        //IO.init(server);
        WS.init(server);

    }


    static function handle(im : IncomingMessage, sr : ServerResponse) { 
            sr.setTimeout(10000);
            var body = "";
			im.on("data", function(chunk : String) {
                if(body.length > 1e4) {
                    new ErrorPage(im, sr, body, "you are trying to send too much data to the server", 413);
                    im.destroy();
                }
                body += chunk; 
            });
			im.on("end", function() { new App(im, sr, body); });
    }

    function new(im : IncomingMessage, sr : ServerResponse, body : String) {
        if (im.url == "/" || im.url.indexOf(".") != -1) {
            new FrontController(im, sr);
            return;
        } 
        var idx : Int = im.url.indexOf("?", 1);
        if (idx == -1) idx = im.url.indexOf("/", 1);
        var route : String = idx == -1 ? im.url : im.url.substring(0, idx);
        switch (route) { //routage
            case "/connect": new ConnectController(im, sr, body);
            case "/twitch": new TwitchController(im, sr, body);
            default: new ErrorPage(im, sr, body, "Sorry, you are looking for something that doesn't exist!", 404);
        }
    }

}