package response;

import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;

class Security {
    
    public static function pass(im:IncomingMessage, sr:ServerResponse):Bool {
        sr.setHeader("Strict-Transport-Security", "max-age=63072000");
        sr.setHeader("X-Frame-Options", "DENY");
        trace(im.headers["X-Forwarded-Proto"]);
        if (im.headers["X-Forwarded-Proto"] != "https") {
            trace("This connection is NOT encrypted");
            sr.writeHead(PermanentRedirect, {
                'Location': 'https://'+im.headers["X-Forwarded-Host"]+im.url
              });
            sr.end();
            return false;
        }
        trace("This connection is encrypted");
        return true;
    }

}