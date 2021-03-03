package controller.connect;

import tink.Json;
import response.ErrorResponse;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;

class ConnectController {

    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    var form : ConnectionRequest;
    
    public function new(im : IncomingMessage, sr : ServerResponse, body : String) {
		this.im = im;
        this.sr = sr;
        this.body = body;
        if (im.method != Post) {
            new ErrorResponse(im, sr, body, "Method not allowed!", MethodNotAllowed);
            return;
        }
        try {
            form = Json.parse(body);
        } catch (e:Dynamic) {
            new ErrorResponse(im, sr, body, "form data is invalid",400);
            return;
        }
        switch form.type {
            case PublicJoin: new PublicJoinController(im, sr, body, form);
            case PrivateCreate: new PrivateCreateController(im, sr, body, form);
            case PrivateJoin: new PrivateJoinController(im, sr, body, form);
            default: new ErrorResponse(im, sr, body, "invalid lobby type",400);
        }
        
    }

}