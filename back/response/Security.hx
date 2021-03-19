package response;

import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;

class Security {
    
    public static function pass(im:IncomingMessage, sr:ServerResponse):Bool {
        sr.setHeader("Strict-Transport-Security", "max-age=63072000");
        sr.setHeader("X-Frame-Options", "DENY");
        return true;
    }

}