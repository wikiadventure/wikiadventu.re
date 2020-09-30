package controller;

import lobby.TwitchLobby;
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
            if(language==null) throw "";
        } catch (e:Dynamic) {
            language = en;
        }
        var player:Player;
        try {
            player = new Player(data['pseudo'], language);
        } catch (e:Dynamic) {
            new ErrorPage(im, sr, body, e,400);
            return;
        }

        switch data['type'] {
            case "publicJoin": publicJoin(player); return;
            case "privateJoin": privateJoin(data, player); return;
            case "privateCreate": privateCreate(data, player); return;
        }
        new ErrorPage(im, sr, body, "invalid lobby type",400);
    }
    
    public function publicJoin(player:Player) {
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
    }

}