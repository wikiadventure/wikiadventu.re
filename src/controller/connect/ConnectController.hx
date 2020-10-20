package controller.connect;

import tink.Json;
import error.ErrorPage;
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
            new ErrorPage(im, sr, body, "Method not allowed!", MethodNotAllowed);
            return;
        }
        try {
            form = Json.parse(body);
        } catch (e:Dynamic) {
            new ErrorPage(im, sr, body, "form data is invalid",400);
            return;
        }
        switch form.type {
            case PublicJoin: new PublicJoinController(im, sr, body, form);
            case PrivateCreate: new PrivateCreateController(im, sr, body, form);
            case PrivateJoin: new PrivateJoinController(im, sr, body, form);
            default: new ErrorPage(im, sr, body, "invalid lobby type",400);
        }
        
    }
    
    /*public function publicJoin(player:Player) {
        try {
            var lobby = Lobby.joinPublicFree(player);
            new GamePage(im, sr, lobby, player);
        } catch (e:Dynamic) {
            trace("here");
            new ErrorPage(im, sr, body, "server full"+e,400);
            
        }
        
    }
    public function privateJoin(data:QuerystringParseResult, player:Player) {
        trace("privatejoin");
        try {
            var lobby = Lobby.find(Lobby.decodeID(data['id']));
            lobby.connect(player, data['password']);
            new GamePage(im, sr, lobby, player);
        } catch (e:Dynamic) {
            new ErrorPage(im, sr, body, "internal error : "+e,400);
        }
    }
    public function privateCreate(data:QuerystringParseResult, player:Player) {
        trace("privatecreate");
        try {
            var lobby = new Lobby(player.language, Private, data['password']);
            lobby.giveID();// giveID method also add the lobby to the lobbylist
            lobby.initNamespace();
            lobby.connect(player, data['password']);
            lobby.votePhase();
            new GamePage(im, sr, lobby, player);
        } catch (e:Dynamic) {
            new ErrorPage(im, sr, body, "internal error"+e,400);
        }
    }*/

}