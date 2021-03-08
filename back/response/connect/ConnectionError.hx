package response.connect;

import controller.connect.ConnectionResponse;
import haxe.Json;
import controller.connect.error.ConnectError;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;

class ConnectionError {
	var im : IncomingMessage;
	var sr : ServerResponse;
	
	public function new(im : IncomingMessage, sr : ServerResponse, errorCode:ConnectError) {
		this.im = im;
		this.sr = sr;
		this.sr.writeHead(400);
        var json:ConnectionResponse = {
            status: Error,
            errorCode: errorCode
        };
		this.sr.write(Json.stringify(json));
		this.sr.end();
	}
}
