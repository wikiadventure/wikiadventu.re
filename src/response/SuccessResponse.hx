package response;

import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;

class SuccessResponse {
	
	public function new(im : IncomingMessage, sr : ServerResponse, textJson:String) {
		sr.setHeader("Content-Type", "application/json");
		sr.writeHead(OK);
		sr.write(textJson);
		sr.end();
	}
}
