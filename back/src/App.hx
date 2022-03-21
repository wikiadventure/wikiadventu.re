import controller.daily.DailyPage;
import controller.daily.DailyController;
import controller.info.BadgeController;
import utils.crypto.RandomBase32;
import config.admin.Guard;
import controller.info.InfoController;
import macros.Env;
import lobby.TwitchLobby;
import config.twitch.TwitchCredential;
import controller.FrontController;
import js.node.Http;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import async.WS;
import response.ErrorResponse;
import controller.connect.ConnectController;
import controller.connect.twitch.TwitchController;
import controller.admin.LogController;
import controller.admin.StatController;
import controller.admin.AnnounceController;
import lobby.Lobby;
import js.Node.console;
import js.Node.process;
#if https
import js.node.Https;
#end

class App {

    static function main() {
        Guard.init();
        RandomBase32.init();
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
        DailyController.init();
        server.listen(Env.get("PORT"));// take the port mentionned in the port compilation flag otherwise take the env one
        WS.init(server);
        console.log("server start");
    }


    static function handle(im : IncomingMessage, sr : ServerResponse) { 
        sr.setTimeout(10000);
        var body = "";
		im.on("data", function(chunk : String) {
            if(body.length > 1e4) {
                new ErrorResponse(im, sr, body, "you are trying to send too much data to the server", 413);
                im.destroy();
            }
            body += chunk; 
        });
		im.on("end", function() { new App(im, sr, body); });
    }

    function new(im : IncomingMessage, sr : ServerResponse, body : String) {
        sr.setHeader("Access-Control-Allow-Origin","*");
        var idx1 = im.url.indexOf("/", 1);
        var route1 : String = idx1 == -1 ? im.url : im.url.substring(1, idx1);
        switch (route1) {
            case "api": 
                var idx2 = im.url.indexOf("/", 5);
                if (idx2 == -1) idx2 = im.url.indexOf("?", 5);
                var route2 : String = idx2 == -1 ? im.url.substring(5) : im.url.substring(5, idx2);
                switch (route2) {
                    case "info": new InfoController(im,sr);
                    case "connect": new ConnectController(im, sr, body);
                    case "twitch": new TwitchController(im, sr, body);
                    case "daily": new DailyController(im, sr, body);
                    case "log": new LogController(im, sr, body);
                    case "stat": new StatController(im, sr, body);
                    case "announce": new AnnounceController(im, sr, body);
                    case "badge": new BadgeController(im, sr);
                    //case "help" to help dev
                    default: new ErrorResponse(im, sr, body, "Sorry, you are looking for something that doesn't exist!", 404);
                }
            default: new FrontController(im, sr);
        }
    }
}