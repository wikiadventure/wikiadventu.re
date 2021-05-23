package controller.info;

import haxe.Json;
import response.SuccessResponse;
import js.node.http.ServerResponse;
import js.node.http.IncomingMessage;
using StringTools;
import async.WS;

class BadgeController {
    
    var im : IncomingMessage;
    var sr : ServerResponse;

    public function new(im : IncomingMessage, sr : ServerResponse) {
        this.im = im;
        this.sr = sr;
        var n = WS.server.clients.size;
        var res:BadgeEndpoint = {
            schemaVersion: 1,
            label: "Wiki Adventure",
            message: n + " online" + (n > 1 ? "s" : ""),
            color: "green"
        };
        new SuccessResponse(im, sr, Json.stringify(res));        
    }

}


typedef BadgeEndpoint= {
    schemaVersion: Int,
    label: String,
    message: String,
    color: String
}
