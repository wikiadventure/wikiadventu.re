package config.twitch;

import js.node.Fs;

class TwitchCredential {
    
    public static var clientID:String;
    public static var clientSecret:String;
    public static var redirectURL:String;
    public static var botUsername:String;
    public static var botPassword:String;
    

    public static function init() {
        clientID = Fs.readFileSync('config/twitch/clientID', 'utf8');
        clientSecret = Fs.readFileSync('config/twitch/clientSecret', 'utf8');
        redirectURL = Fs.readFileSync('config/twitch/redirectURL', 'utf8');
        botUsername = Fs.readFileSync('config/twitch/botUsername', 'utf8');
        botPassword = Fs.readFileSync('config/twitch/botPassword', 'utf8');
    }

}