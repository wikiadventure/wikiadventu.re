package controller.connect.twitch;

import lobby.gameLoop.Classic;
import response.SuccessResponse;
import lobby.player.Player;
import controller.connect.twitch.TwitchConnectionRequest;
import haxe.crypto.Sha256;
import haxe.Timer;
import lobby.player.TwitchPlayer;
import twitch.HelixPrivilegedUser;
import js.lib.Promise;
import twitch.StaticAuthProvider;
import twitch.ApiClient;
import twitch.AccessToken;
import config.twitch.TwitchCredential;
import lobby.TwitchLobby;
import response.ErrorResponse;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;
import js.node.Querystring;
import uuid.Uuid;
import tink.Json;

class TwitchController {
    
    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    var form : TwitchConnectRequest;
    var authProvider : StaticAuthProvider;
    
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
        new ErrorResponse(im, sr, body, "Invalid method. Method available: Get and Post",BadRequest);
        return;
    }

    public function onTwitchRedirect() {
        var uuid:String;
        var code:String;
        try {
            var idx = im.url.indexOf("?", 1);
            var data = Querystring.parse(im.url.substring(idx+1));
            uuid = data['state'];
            if ( !( Uuid.validate(uuid) && Uuid.version(uuid) == 4 ) ) throw "Invalid uuid please provide a valid version 4 uuid in the redirectUrl state of twitch login";
            code = data['code'];
            if (code == null) throw "invalid twitch access, please retry!";
            sr.setHeader('Content-Type', 'text/html; charset=utf-8');
            sr.write("
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>WikiAdventure Twitch login redirection</title>
                    </head>
                    <body>
                    <script type='text/javascript'>setTimeout(function(){ window.close(); }, 500);</script>
                    </body>
                </html>
            ");
            sr.end();
        } catch (e:Dynamic) {
            trace(e);
            new ErrorResponse(im, sr, body, e, PreconditionFailed);
            return;
        }
        proceedTwitchLogin(uuid, code);
            
    }

    public function proceedTwitchLogin(uuid:String, code:String) {
        var loginStatus:TwitchLogin = new TwitchLogin(uuid);
        TwitchCredential.loginStatusList.push(loginStatus);
        Timer.delay(function () {
            loginStatus.error = "Cannot retrieve token after 30 sec";
            loginStatus.status = Error;
            TwitchCredential.loginStatusList.remove(loginStatus);
        },30000); // remove the access if it's not retrieve in 30sec
        getAccessToken(code)
        .then(getTwitchUser)
        .then(function(user:HelixPrivilegedUser) {
            loginStatus.user = user;
            loginStatus.authProvider = authProvider;
            loginStatus.status = Success;
        }, function(reject) {
            loginStatus.error = "promise failed : " + reject;
            loginStatus.status = Error;
        });
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

    public function connect() {
        try {
            form = Json.parse(body);
            if (form.type == TwitchJoinWithout) return connectWithoutTwitch();
            if ( !( form.type == TwitchCreate || (form.type == TwitchJoinWith && form.lobby != null) ) ) throw "To connect with twitch use login type of TwitchCreate, or TwitchJoinWith with the lobby name";
            if (form.uuid == null) throw "The JSON provided does not have a uuid field";
            var loginStatus = searchLoginStatus(form.uuid);
            if (loginStatus.status == Pending) {
                sr.writeProcessing();
                loginStatus.onStatusChange = function(status:TwitchLoginStatus) {
                    respond(loginStatus, status);
                    loginStatus.onStatusChange = null;
                };
                return;
            }
            respond(loginStatus);
        } catch (e:Dynamic) {
            trace(e);
            new ErrorResponse(im, sr, body, "error", BadRequest);
            return;
        }
    }

    public function respond(loginStatus:TwitchLogin, ?status:TwitchLoginStatus) {
        if (status == null) status = loginStatus.status;
        if (status == Error) {
            new ErrorResponse(im, sr, body, loginStatus.error, BadRequest);
            return;
        }
        var player = new TwitchPlayer(loginStatus.user, loginStatus.authProvider, form.lang);
        var passwordHash = Sha256.encode(form.password);
        var lobby:TwitchLobby;
        try {
            if (form.type == TwitchCreate) {
                lobby = twitchCreate(player, passwordHash);
            } else {
                lobby = TwitchLobby.find(form.lobby);
                lobby.join(player,passwordHash);    
            }
        } catch(e:Dynamic) {
            new ErrorResponse(im, sr, body, e,BadRequest);
            return;
        }
        var json:ConnectionResponse = {
            status: Success,
            lobbyID: lobby.name,
            lobbyType: Twitch,
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
            var json:ConnectionResponse = {
                status: Success,
                lobbyID: lobby.name,
                lobbyType: Twitch,
                playerID: player.uuid,
                lang: lobby.language           
            };
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch (e:Dynamic) {
            new ErrorResponse(im, sr, body, "internal error : "+e,400);
        }
    }

    public function searchLoginStatus(uuid:String):TwitchLogin {
        for (l in TwitchCredential.loginStatusList) {
            if (l.uuid == uuid) {
                return l;
            }
        }
        throw "The uuid provided is not registered or has time out after 30 sec of inactivity";
    }

    public function twitchCreate(player:TwitchPlayer, passwordHash:String):TwitchLobby {
        trace("create the twitch lobby");
        var lobby = new TwitchLobby(player, passwordHash);
        lobby.giveID();// giveID method also add the lobby to the lobbylist
        lobby.join(player, passwordHash);
        lobby.gameLoop = new Classic(lobby, 5);
        return lobby;
    }
}