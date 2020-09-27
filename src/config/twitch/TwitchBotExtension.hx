package config.twitch;

import twitch_chat_client.ChatClient;
using Lambda;

class TwitchBotExtension {
    
    public static function sayAll(twitchBot:ChatClient, channels:Array<String>, msg:String) {
        channels.iter(function(c) twitchBot.say(c,msg));
    }

}