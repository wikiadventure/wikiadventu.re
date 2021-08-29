package config.twitch;

import lobby.player.TwitchPlayer;
using Lambda;

class TwitchBotExtension {
    
    public static function sayAll(twitchPlayers:Array<TwitchPlayer>, msg:String) {
        twitchPlayers.iter(function(p) p.twitchBot.say(p.twitchUser.name,msg));
    }

}