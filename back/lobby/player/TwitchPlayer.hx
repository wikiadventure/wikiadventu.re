package lobby.player;

import js.node.Timers;
import config.twitch.TwitchCredential;
import twitch_chat_client.PrivateMessage;
import twitch.AuthProvider;
import twitch_chat_client.ChatClient;
import config.Lang;
import twitch.HelixPrivilegedUser;
import lobby.gameLoop.Phase.PhaseType;

class TwitchPlayer extends Player {
    
    public var twitchUser:HelixPrivilegedUser;
    public var twitchBot:ChatClient;
    public var authProvider:AuthProvider;
    public var twitchLobby:TwitchLobby;
    
    public function new(twitchUser:HelixPrivilegedUser, authProvider:AuthProvider, language:Lang) {
        super(twitchUser.name, language);
        this.twitchUser = twitchUser;
        twitchBot = new ChatClient(authProvider, { channels: [twitchUser.name] });

        twitchBot.onMessage(chatMessageHandler);
        twitchBot.connect();

    }

    public function chatMessageHandler(channel:String, user:String, msg:String, message:PrivateMessage) {
        if (twitchLobby == null || user == TwitchCredential.botUsername) return;
        if (msg.length > 231) return;
        msg = StringTools.trim(msg);
        if (StringTools.startsWith(msg, "!vote ") && twitchLobby.gameLoop.currentPhase.type  == Voting) {
            twitchLobby.log(user + " from " + channel + " submitted this vote :", Info);
            if (twitchLobby.suggestionList.length < TwitchLobby.suggestionLimit) {
                var title = msg.substr(6);
                twitchLobby.suggestionList.push(title);
                twitchBot.say(twitchUser.name, "You voted " + title);
                if (twitchLobby.suggestionList.length == TwitchLobby.suggestionLimit) twitchBot.say(channel, LangTools.getTwitchVoteCap(twitchLobby.language));
                twitchLobby.log(title, Info);
            }
            return;
        } 
        
    }

}