package controller;

import lobby.ConnectionPage;
import lobby.Lobby;
import lobby.player.Player;
import config.Language;
import error.ErrorPage;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;
import js.node.Fs;
import js.node.Querystring;
import lobby.GamePage;

class ConnectController {

    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    
    public function new(im : IncomingMessage, sr : ServerResponse, body : String) {
		this.im = im;
        this.sr = sr;
        this.body = body;
        var data : QuerystringParseResult = null;
        if (im.method == Get) {
            new ConnectionPage(im, sr);
            return;
        }
        if (im.method != Post) {
            new ErrorPage(im, sr, body, "Method not allowed!", MethodNotAllowed);
            return;
        }
        try {
            data = Querystring.parse(body);
        } catch (e:Dynamic) {
            new ErrorPage(im, sr, body, "form data is invalid",400);
            return;
        }

        var language:Language;
        try {
            language = cast(data['language'], String);
        } catch (e:Dynamic) {
            language = en;
        }
        if (language == null) {
            language = en;
        }
        var player:Player;
        try {
            player = new Player(im.socket, data['pseudo'], language);
        } catch (e:Dynamic) {
            new ErrorPage(im, sr, body, e,400);
            return;
        }

        switch data['type'] {
            case "publicJoin": publicJoin(player);
            case "privateJoin": privateJoin(data);
            case "privateCreate": privateCreate(data);
        }
        
    }
    
    public function publicJoin(player:Player) {
        trace("publicjoin");
        try {
            var lobby = Lobby.joinPublicFree(player);
            new GamePage(im, sr, lobby, player);
        } catch (e:Dynamic) {
            trace("here");
            new ErrorPage(im, sr, body, "server full"+e,400);
            
        }
        
    }
    public function privateJoin(data:QuerystringParseResult) {
        trace("privatejoin");
        new ErrorPage(im, sr, body, "not implemented",400);
    }
    public function privateCreate(data:QuerystringParseResult) {
        trace("publicreate");
        new ErrorPage(im, sr, body, "not implemented",400);
    }

}