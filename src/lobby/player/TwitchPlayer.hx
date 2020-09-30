package lobby.player;

import config.twitch.TwitchCredential;
import twitch_chat_client.PrivateMessage;
import twitch.AuthProvider;
import twitch_chat_client.ChatClient;
import config.Language;
import twitch.HelixPrivilegedUser;

class TwitchPlayer extends Player {
    
    public var twitchUser:HelixPrivilegedUser;
    public var twitchBot:ChatClient;
    public var authProvider:AuthProvider;
    public var twitchLobby:TwitchLobby;
    
    public function new(twitchUser:HelixPrivilegedUser, authProvider:AuthProvider, language:Language) {
        super(twitchUser.name, language);
        this.twitchUser = twitchUser;
        twitchBot = new ChatClient(authProvider);
        twitchBot.onMessage(chatMessageHandler);
        twitchBot.connect();
        

    }

    public function chatMessageHandler(channel:String, user:String, msg:String, message:PrivateMessage) {
        if (twitchLobby == null || user == TwitchCredential.botUsername) return;
        if (msg.length > 231) return;
        msg = StringTools.trim(msg);
        if (StringTools.startsWith(msg, "!vote ") && twitchLobby.state == Voting) {
            twitchLobby.log(user + " from " + channel + " submitted this vote :", Info);
            if (twitchLobby.suggestionList.length < TwitchLobby.suggestionLimit) {
                var title = msg.substr(6);
                twitchLobby.suggestionList.push(title);
                if (twitchLobby.suggestionList.length == TwitchLobby.suggestionLimit) twitchBot.say(channel, "Maximun vote reached!");
                twitchLobby.log(title, Info);
            }
            return;
        } 
        
    }

    /*twitchBot.onMessage(chatMessageHandler)
        twitchBot.join(twitchPlayer.twitchUser.name).then(
            function(v) {
                twitchPlayerList.push(twitchPlayer);
                addPlayer(twitchPlayer);
                twitchBot.say(twitchPlayer.twitchUser.name, twitchPlayer.twitchUser.name + " just join a game of wiki adventure!");
            }, function(reason) {
                log("error during chat bot connection on channel " + twitchPlayer.twitchUser.name + " : " + reason, Error);
        });*/

}