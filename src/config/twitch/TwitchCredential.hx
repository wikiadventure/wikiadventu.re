package config.twitch;

import twitch.ApiClient;
import twitch.AuthProvider;
import js.Node.process;
import twitch_auth.ClientCredentialsAuthProvider;
import twitch.HelixPrivilegedUser;
import twitch.StaticAuthProvider;

class TwitchCredential {
    
    public static var clientID:String;
    public static var clientSecret:String;
    public static var redirectURL:String;
    public static var botUsername:String;
    public static var botPassword:String;
    public static var loginStatusList:Array<TwitchLogin>;
    
    public static function init() {
        clientID = process.env['TWITCH_CLIENT_ID'];
        clientSecret = process.env['TWITCH_CLIENT_SECRET'];
        redirectURL = process.env['TWITCH_REDIRECT_URL'];
        botUsername = process.env['TWITCH_BOT_USERNAME'];
        botPassword = process.env['TWITCH_BOT_PASSWORD'];
        loginStatusList = new Array<TwitchLogin>();
    }

    public static function getApiClient():ApiClient {
        return ApiClient.withClientCredentials(clientID, clientSecret);
    }

}

enum abstract TwitchLoginStatus(Int) {
    var Success;
    var Pending;
    var Error;
}

class TwitchLogin {
    public var uuid:String;
    public var status(default, set):TwitchLoginStatus;
    public function set_status(s:TwitchLoginStatus) {
        if (onStatusChange != null) onStatusChange(s);
        return status = s;
    }
    public var error:String;
    public var user:HelixPrivilegedUser;
    public var authProvider:StaticAuthProvider;

    public function new(?uuid:String) {
        this.status = Pending;
        this.uuid = uuid;
    }

    public dynamic function onStatusChange(status:TwitchLoginStatus) {
        
    }

}