package config.twitch;

import macros.Env;
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
    
    public static function init() {
        clientID = Env.get('TWITCH_CLIENT_ID');
        clientSecret = Env.get('TWITCH_CLIENT_SECRET');
        redirectURL = Env.get('TWITCH_REDIRECT_URL');
        botUsername = Env.get('TWITCH_BOT_USERNAME');
        botPassword = Env.get('TWITCH_BOT_PASSWORD');
    }

    public static function getApiClient():ApiClient {
        return ApiClient.withClientCredentials(clientID, clientSecret);
    }

}
