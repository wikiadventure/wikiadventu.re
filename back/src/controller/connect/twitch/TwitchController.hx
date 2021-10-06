package controller.connect.twitch;

import haxe.Json;
import response.connect.ConnectionError;
import response.SuccessResponse;
import lobby.player.Player;
import controller.connect.twitch.TwitchConnectRequest;
import haxe.crypto.Sha256;
import lobby.player.TwitchPlayer;
import twitch.HelixPrivilegedUser;
import js.lib.Promise;
import twitch.StaticAuthProvider;
import twitch.ApiClient;
import twitch.AccessToken;
import config.twitch.TwitchCredential;
import lobby.TwitchLobby;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import js.node.Querystring;

using lobby.GameLoop;
using Lambda;

class TwitchController {
    
    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    var form : TwitchConnectRequest;
    var authProvider : StaticAuthProvider;
    var user : HelixPrivilegedUser;
    
    public function new(im : IncomingMessage, sr : ServerResponse, body : String ) {
        this.im = im;
        this.sr = sr;
        this.body = body;
        if (im.method == Get) {
            onTwitchRedirect();
            return;
        } 
        if (im.method == Post) {
            connect();
            return;
        }
        new ConnectionError(im, sr, InvalidMethod);
        return;
    }

    public function onTwitchRedirect() {
        var idx = im.url.indexOf("?", 1);
        var data = Querystring.parse(im.url.substring(idx+1));
        var code = data['code'];
        if (code == null) {
            new ConnectionError(im, sr, InvalidTwitchCode);
            return; 
        } 
        sr.setHeader('Content-Type', 'text/html; charset=utf-8');
        sr.write("
            <!DOCTYPE html>
            <html>
                <head>
                    <title>WikiAdventure Twitch login redirection</title>
                </head>
                <body>
                <script type='text/javascript'>
                window.opener.postMessage(" + Json.stringify({code: code}) + ", window.location.origin);
                setTimeout(function(){ window.close(); }, 500);
                </script>
                </body>
            </html>
        ");
        sr.end();
    }

    public function proceedTwitchLogin(code:String):Promise<HelixPrivilegedUser> {
        return getAccessToken(code).then(getTwitchUser);
    }

    public function getAccessToken(code:String):Promise<AccessToken> {
         return ApiClient.getAccessToken_(TwitchCredential.clientID, TwitchCredential.clientSecret, code, TwitchCredential.redirectURL);
        
    }

    public function getTwitchUser(token:AccessToken):Promise<HelixPrivilegedUser> {
        authProvider = new StaticAuthProvider(TwitchCredential.clientID, token);
        var apiClient = new ApiClient({authProvider: authProvider});
        return apiClient.helix.users.getMe();  
    }

    public function connect() {
        try {
            form = Json.parse(body);
            if (form.type == TwitchJoinWithout) return connectWithoutTwitch();
            if ( !( form.type == TwitchCreate || (form.type == TwitchJoinWith && form.lobby != null) ) ) new ConnectionError(im, sr, InvalidLobbyType);
                //throw "To connect with twitch use login type of TwitchCreate, or TwitchJoinWith with the lobby name";
            if (form.code == null) throw "The JSON provided does not have a code field";
            proceedTwitchLogin(form.code).then(
                user -> {
                    this.user = user;
                    respond();
                }
            ).catchError(
                (e) -> {
                    trace(e);
                    new ConnectionError(im, sr, TwitchConnectionError);
                }
            );
        } catch (e:Dynamic) {
            new ConnectionError(im, sr, InvalidForm);
            return;
        }
    }

    public function respond() {
        var player = new TwitchPlayer(form.pseudo, user, authProvider, form.lang);
        var lobby:TwitchLobby;
        try {
            if (form.type == TwitchCreate) {
                lobby = twitchCreate(player, form);
            } else {
                lobby = TwitchLobby.find(form.lobby);
                var passwordHash = Sha256.encode(form.password);
                lobby.join(player,passwordHash);    
            }
        } catch(e:Dynamic) {
            new ConnectionError(im, sr, e);
            return;
        }
        var json:ConnectResponse = {
            lobbyID: lobby.name,
            lobbyType: Twitch,
            slot: lobby.slot,
            gameLoop: lobby.gameLoop.type,
            playerID: player.uuid,
            lang: lobby.language
        };
        new SuccessResponse(im, sr, Json.stringify(json));

    }

    public function connectWithoutTwitch() {
        var player = new Player(form.pseudo, form.lang);
        var passwordHash = Sha256.encode(form.password);
        try {
            var lobby = TwitchLobby.find(form.lobby);
            lobby.connect(player, passwordHash);
            var json:ConnectResponse = {
                lobbyID: lobby.name,
                lobbyType: Twitch,
                slot: lobby.slot,
                gameLoop: lobby.gameLoop.type,
                playerID: player.uuid,
                lang: lobby.language           
            };
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch (e:Dynamic) {
            new ConnectionError(im, sr, e);
        }
    }

    public function twitchCreate(player:TwitchPlayer, form:TwitchConnectRequest):TwitchLobby {
        var passwordHash = Sha256.encode(form.password);
        var lobby = new TwitchLobby(player, passwordHash, form.slot);
        lobby.join(player, passwordHash);
        lobby.select(form.gameLoop, form.config);
        lobby.gameLoop.start();
        return lobby;
    }
}