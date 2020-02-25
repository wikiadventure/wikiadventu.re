package error;

import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;

class ErrorPage {
	var im : IncomingMessage;
	var sr : ServerResponse;
	
	public function new(im : IncomingMessage, sr : ServerResponse, body:String, reason:String, errorCode:Int) {
		this.im = im;
		this.sr = sr;
		trace(body.length);
		this.sr.setHeader("Content-Type", "text/html");
		this.sr.writeHead(errorCode);
		this.sr.write(reason);
		this.sr.end();
	}
}
