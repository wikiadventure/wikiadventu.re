package config.twitch;

import js.Node.process;

class TwitchCredential {
    
    public static var clientID:String;
    public static var clientSecret:String;
    public static var redirectURL:String;
    public static var botUsername:String;
    public static var botPassword:String;
    

    public static function init() {
        clientID = process.env['TWITCH_CLIENT_ID'];
        clientSecret = process.env['TWITCH_CLIENT_SECRET'];
        redirectURL = process.env['TWITCH_REDIRECT_URL'];
        botUsername = process.env['TWITCH_BOT_USERNAME'];
        botPassword = process.env['TWITCH_BOT_PASSWORD'];
    }

}