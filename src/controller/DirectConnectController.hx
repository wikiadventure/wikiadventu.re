package controller;

import lobby.DirectPublicJoinPage;
import lobby.DirectPrivateJoinPage;
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

class DirectConnectController {

    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    
    public function new(im : IncomingMessage, sr : ServerResponse, body : String) {
        trace("direct connect");
		this.im = im;
        this.sr = sr;
        this.body = body;
        var data : QuerystringParseResult = null;
        if (im.method == Get) {
            try {
                var idx = im.url.indexOf("/", 1);
                var lobbyID = Lobby.decodeID(im.url.substring(idx+1));
                var lobby = Lobby.find(lobbyID);
                if (lobby.type == Private) {
                    new DirectPrivateJoinPage(im, sr, lobby);
                } else {
                    new DirectPublicJoinPage(im, sr, lobby);
                }
            } catch (e:Dynamic) {
                trace(e);
                new ErrorPage(im, sr, body, "internal error : " + e, MethodNotAllowed);
                return;
            }
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
        var lobby:Lobby = null;
        try {
            var idx = im.url.indexOf("/", 1);
            var lobbyID = Lobby.decodeID(im.url.substring(idx+1));
            lobby = Lobby.find(lobbyID);
        } catch (e:Dynamic) {
            trace(e);
            new ErrorPage(im, sr, body, "internal error : " + e, MethodNotAllowed);
            return;
        }

        var player:Player;
        try {
            player = new Player(data['pseudo'], lobby.language);
            lobby.connect(player, data['password']);
            new GamePage(im, sr, lobby, player);
            return;
        } catch (e:Dynamic) {
            new ErrorPage(im, sr, body, e,400);
            return;
        }
    }

}