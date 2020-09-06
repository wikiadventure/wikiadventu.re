import config.twitch.TwitchCredential;
import js.node.Fs;
import js.node.Https;
import controller.SHTMLController;
import controller.ScriptController;
import haxe.Timer;
import haxe.http.HttpBase;
import js.html.Worker;
import js.html.ServiceWorker;
import js.html.FetchObserver;
import js.node.http.Agent;
import js.html.XMLHttpRequest;
import js.html.Request;
import js.node.http.Method;
import js.node.Http;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import async.IO;
import lobby.ConnectionPage;
import error.ErrorPage;
import controller.StyleController;
import controller.ConnectController;
import controller.ResController;
import controller.DirectConnectController;
import controller.TwitchController;
import lobby.Lobby;

class App {

    public static var count = 0;
    public static var timestamp:Float;

    static function main() {
        Lobby.init(); 

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
        server.listen(5000);
        IO.init(server);

    }


    static function handle(im : IncomingMessage, sr : ServerResponse) {        
            //IO.init();
            sr.setTimeout(150);
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
        
        var idx : Int = im.url.indexOf("?", 1);
        if (idx == -1) idx = im.url.indexOf("/", 1);
        var route : String = idx == -1 ? im.url : im.url.substring(0, idx);
        Sys.println(route);
        switch (route) { //routage
            case "/": new MainPage(im, sr);
            case "/css": new StyleController(im, sr);
            case "/js": new ScriptController(im, sr);
            case "/shtml": new SHTMLController(im, sr);
            case "/connect": new ConnectController(im, sr, body);
            case "/res": new ResController(im, sr);
            case "/play": new DirectConnectController(im, sr, body);
            case "/twitch": new TwitchController(im, sr, body);
            default: new ErrorPage(im, sr, body, "Sorry, you are looking for something that doesn't exist!", 404);
        }
    }

}