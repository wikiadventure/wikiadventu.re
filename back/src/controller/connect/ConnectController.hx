package controller.connect;

import haxe.Json;
import response.connect.ConnectionError;

import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;

class ConnectController {

    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    var form : ConnectRequest;
    
    public function new(im : IncomingMessage, sr : ServerResponse, body : String) {
		this.im = im;
        this.sr = sr;
        this.body = body;
        if (im.method != Post) {
            new ConnectionError(im, sr, InvalidMethod);
            return;
        }
        try {
            form = Json.parse(body);
            form.config = form.config != null ? form.config : {};
        } catch (e:Dynamic) {
            new ConnectionError(im, sr, InvalidForm);
            return;
        }
        switch form.type {
            case PublicJoin: new PublicJoinController(im, sr, body, form);
            case PrivateCreate: new PrivateCreateController(im, sr, body, form);
            case PrivateJoin: new PrivateJoinController(im, sr, body, form);
            default: new ConnectionError(im, sr, InvalidLobbyType);
        }
        
    }

}
