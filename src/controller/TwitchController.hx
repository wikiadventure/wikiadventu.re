package controller;

import config.twitch.TwitchCredential;
import haxe.Json;
import js.node.Querystring;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import js.node.Https;
import error.ErrorPage;
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

class TwitchController {
    
    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    
    public function new(im : IncomingMessage, sr : ServerResponse, body : String) {
        this.im = im;
        this.sr = sr;
        this.body = body;
        if (im.method == Get) {
            try {
                getAccessToken(im, sr);
            } catch (e:Dynamic) {
                trace(e);
                new ErrorPage(im, sr, body, "internal error : " + e, MethodNotAllowed);
                return;
            }
        }
    }

    public function getAccessToken(im : IncomingMessage, sr : ServerResponse) {
        var idx = im.url.indexOf("?", 1);
        var data = Querystring.parse(im.url.substring(idx+1));
        var queryString = Querystring.stringify({ 
            code: data['code'],
            client_id: TwitchCredential.clientID,
            client_secret: TwitchCredential.clientSecret,
            grant_type: "authorization_code",
            redirect_uri: TwitchCredential.redirectURL
        });
        var options:HttpsRequestOptions =  {
            hostname: "id.twitch.tv",
            path: "/oauth2/token?" + queryString,
            method: 'POST'     
        };
        var request = Https.request(options, function (response) {
            var body = '';

            response.on('data', function (chunk) {
                body = body + chunk;
            });
            response.on('end', function () {
                var twitchAccess:TwitchAccessTokenResponse = Json.parse(body);
                if (twitchAccess.access_token == null) throw "Connection Failed!";
                getTwitchUsername(twitchAccess.access_token);
            });
        });
        request.on('error', function (e) {
            trace(e);
        });
        request.end();
    }

    public function getTwitchUsername(token:String) {
        var options:HttpsRequestOptions =  {
            hostname: "api.twitch.tv",
            path: "/helix/users",
            method: 'POST',
            headers: {
                "Client-ID": TwitchCredential.clientID,
                'Authorization': 'Bearer ' + token

            }
            
        };
        var request = Https.request(options, function (response) {
            var body = '';

            response.on('data', function (chunk) {
                body = body + chunk;
            });
            response.on('end', function () {
                var twitchUsers:TwitchUsersResponse = Json.parse(body);
                if (twitchUsers.data[0] == null) throw "Connection Failed!";
                
            });
        });
        request.on('error', function (e) {
            trace(e);
        });
        request.end();
    }

    public function privateTwitchCreate(user:TwitchUser, player:Player, password:String) {
        trace("twitchCreate");
        try {
            var lobby = new TwitchLobby(user , player.language, Private, password);
            lobby.giveID();// giveID method also add the lobby to the lobbylist
            lobby.initNamespace();
            lobby.votePhase();
            lobby.connect(player, password);
            new GamePage(im, sr, lobby, player);
        } catch (e:Dynamic) {
            new ErrorPage(im, sr, body, "internal error"+e,400);
        }
    }


}

typedef TwitchAccessTokenResponse = {
    var access_token:String;
    var refresh_token:String;
}
typedef TwitchUsersResponse = {
    var data:Array<TwitchUser>;
}
typedef TwitchUser = {
    var id:String;
    var login:String;
    var display_name:String;
    var type:String;
    var broadcaster_type:String;
    var profile_image_url:String;
    var offline_image_url:String;
    var view_count:Int;

}