package response;

import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;

class ErrorResponse {
	var im : IncomingMessage;
	var sr : ServerResponse;
	
	public function new(im : IncomingMessage, sr : ServerResponse, body:String, reason:String, errorCode:Int) {
		this.im = im;
		this.sr = sr;
		this.sr.writeHead(errorCode);
		this.sr.write(reason);
		this.sr.end();
	}
}
