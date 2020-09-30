package config.twitch;

import lobby.player.TwitchPlayer;
import twitch_chat_client.ChatClient;
using Lambda;

class TwitchBotExtension {
    
    public static function sayAll(twitchBot:ChatClient, twitchPlayers:Array<TwitchPlayer>, msg:String) {
        twitchPlayers.iter(function(p) twitchBot.say(p.twitchUser.name,msg));
    }

}