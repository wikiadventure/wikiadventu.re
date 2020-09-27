package lobby;

import js.lib.Promise;
import twitch_chat_client.PrivateMessage;
import config.twitch.TwitchCredential;
import controller.TwitchController.TwitchUser;
import haxe.Timer;
import config.Language;
import lobby.Lobby.LobbyType;
import twitch_chat_client.ChatClient;
import twitch_chat_client.lib.chatclient.ChatClientOptions;
using config.twitch.TwitchBotExtension;

class TwitchLobby extends Lobby {

    public static var lobbyList:Array<TwitchLobby>;
    public static var suggestionLimit:Int = 100;
    
    public var channelName:Array<String>; // contain all channelname of all streamer connected to the lobby
    public var suggestionList:Array<String>;
    public var twitchBot:ChatClient;


    public function new(user:TwitchUser, language:Language, type:LobbyType, ?passwordHash:String, slot:Int=15, round:Int=3, playTimeOut:Int=600, voteTimeOut:Int=30) {
        super(language, Private, passwordHash, slot, round, playTimeOut, voteTimeOut);
        channelName.push(user.display_name);
        suggestionList = new Array<String>();
        twitchBot = new ChatClient(TwitchCredential.getApiClient());
        

        twitchBot.onMessage(chatMessageHandler);
        twitchBot.connect();   
        join(channelName[0]);

    }

    public static function init() {
        lobbyList = new Array<TwitchLobby>();
    }


    /**
     * the id of the lobby is the channel name of the streamer
     */
    public override function giveID() {
        var pos = 0;
        while ( lobbyList[pos] != null && channelName[0] > lobbyList[pos].channelName[0]) {
            pos++;
        }
        lobbyList.insert(pos,this);
        log("create the lobby", Info);
    }

    public override function playPhaseEnd() {
        suggestionList = new Array<String>();
        super.playPhaseEnd();
    }

    /**
     * start the voting phase
     * and call selectPage when the timer run out
     */
     public override function votePhase() {
        twitchBot.sayAll(channelName, "Vote phase open! You can vote for a wiki page with command !vote YourVote");
        state = Voting;
        initNewPhase();
        if (loop != null) loop.stop();
        loop = Timer.delay(function () {
            twitchBot.sayAll(channelName, "Vote phase closed!");
            selectPage(suggestionList);
        },currentStateTimeOut()*1000);
    }

    public function join(channelName:String) {
        twitchBot.join(channelName).then(
            function(value) {
                twitchBot.say(channelName, channelName + " just join a game of wiki adventure!");
            }, function(reason) {
                log("error during chat bot connection on channel " + channelName + " : " + reason, Error);
        });
    }


    public function chatMessageHandler(channel:String, user:String, msg:String, message:PrivateMessage) {
        if (user == TwitchCredential.botUsername) return;
        if (msg.length > 231) return;
        msg = StringTools.trim(msg);
        if (StringTools.startsWith(msg, "!vote ") && state == Voting) {
            log("someone is voting : ", Info);
            if (suggestionList.length < suggestionLimit) {
                var title = msg.substr(6);
                suggestionList.push(title);
                if (suggestionList.length == suggestionLimit) twitchBot.sayAll(channelName, "Maximun vote reached!");
                log(title, Info);
            }
            return;
        } 
        
    }

 

    public static function find(channelName:String):TwitchLobby {
        for (l in lobbyList) {
            if (l.channelName[0] > channelName) throw "no lobby with channelName " + channelName + " found";
            if (l.channelName[0] == channelName) return l;
        }
        throw "no lobby with channelName " + channelName + " found";
    }



}