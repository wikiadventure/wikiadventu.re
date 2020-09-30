package controller;

import twitch.AuthProvider;
import lobby.player.TwitchPlayer;
import config.Language;
import twitch.HelixPrivilegedUser;
import js.lib.Promise;
import twitch.HelixUser;
import twitch.StaticAuthProvider;
import twitch.ApiClient;
import twitch_auth.lib.Helpers;
import twitch.AccessToken;
import config.twitch.TwitchCredential;
import haxe.Json;
import js.node.Https;
import lobby.TwitchLobby;
import lobby.player.Player;
import error.ErrorPage;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;
import js.node.Querystring;
import lobby.GamePage;

class TwitchController {
    
    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    var authProvider : StaticAuthProvider;
    
    public function new(im : IncomingMessage, sr : ServerResponse, body : String) {
        this.im = im;
        this.sr = sr;
        this.body = body;
        if (im.method == Get) {
            try {
                var idx = im.url.indexOf("?", 1);
                var data = Querystring.parse(im.url.substring(idx+1));
                var code = data['code'];
                if (code == null) throw "invalid twitch access, please retry!";
                this.sr.setHeader('Connection', 'Transfer-Encoding');
                this.sr.setHeader('Content-Type', 'text/html; charset=utf-8');
                this.sr.setHeader('Transfer-Encoding', 'chunked');
                this.sr.writeProcessing();
                this.sr.flushHeaders();
                getAccessToken(code)
                .then(getTwitchUser)
                .then(function(user:HelixPrivilegedUser) {
                    var language:Language;
                    try {
                        language = cast(data['language'], String);
                        if(language==null) throw "";
                    } catch (e:Dynamic) {
                        language = en;
                    }
                    var player:TwitchPlayer;
                    try {
                        player = new TwitchPlayer(user, authProvider, language);
                    } catch (e:Dynamic) {
                        new ErrorPage(im, sr, body, e,400);
                        return;
                    }
                    privateTwitchCreate(player);
                }, function(reject) {
                    throw "promise failed : " + reject;
                    
                });
            } catch (e:Dynamic) {
                trace(e);
                new ErrorPage(im, sr, body, e, MethodNotAllowed);
                return;
            }
        }
    }

    public function getAccessToken(code:String):Promise<AccessToken> {
        trace("get access token");
         return ApiClient.getAccessToken_(TwitchCredential.clientID, TwitchCredential.clientSecret, code, TwitchCredential.redirectURL);
        
    }

    public function getTwitchUser(token:AccessToken):Promise<HelixPrivilegedUser> {
        trace("get Twitch user");
        authProvider = new StaticAuthProvider(TwitchCredential.clientID, token);
        var apiClient = new ApiClient({authProvider: authProvider});
        return apiClient.helix.users.getMe();
        
    }

    public function privateTwitchCreate(player:TwitchPlayer, ?password:String) {
        trace("create the twitch lobby");
        try {
            var lobby = new TwitchLobby(player, password);
            lobby.giveID();// giveID method also add the lobby to the lobbylist
            lobby.initNamespace();
            lobby.connect(player, password);
            lobby.votePhase();
            new GamePage(im, sr, lobby, player);
        } catch (e:Dynamic) {
            new ErrorPage(im, sr, body, "internal error : "+e,400);
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