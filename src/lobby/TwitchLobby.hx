package lobby;

import haxe.Timer;
import twitch.HelixPrivilegedUser;
import twitch.HelixUser;
import twitch_chat_client.PrivateMessage;
import config.twitch.TwitchCredential;
import config.Language;
import lobby.Lobby.LobbyType;
import twitch_chat_client.ChatClient;
import lobby.player.TwitchPlayer;
using config.twitch.TwitchBotExtension;

class TwitchLobby extends Lobby {

    public static var lobbyList:Array<TwitchLobby>;
    public static var suggestionLimit:Int = 100;
    
    public var name:String;
    public var twitchPlayerList:Array<TwitchPlayer>;
    public var suggestionList:Array<String>;
    public var twitchBot:ChatClient;


    public function new(player:TwitchPlayer, ?passwordHash:String, slot:Int=15, round:Int=3, playTimeOut:Int=600, voteTimeOut:Int=30) {
        super(player.language, Twitch, passwordHash, slot, round, playTimeOut, voteTimeOut);
        twitchPlayerList = new Array<TwitchPlayer>();
        suggestionList = new Array<String>();
        name = player.twitchUser.name;
        join(player);

    }

    public static function init() {
        lobbyList = new Array<TwitchLobby>();
    }

    /**
     * the id of the lobby is the channel name of the streamer
     */
    public override function giveID() {
        var pos = 0;
        while ( lobbyList[pos] != null && name > lobbyList[pos].name) {
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
        twitchBot.sayAll(twitchPlayerList, "Vote phase open! You can vote for a wiki page with command !vote YourVote");
        state = Voting;
        initNewPhase();
        if (loop != null) loop.stop();
        loop = Timer.delay(function () {
            twitchBot.sayAll(twitchPlayerList, "Vote phase closed!");
            selectPage(suggestionList);
        },currentStateTimeOut()*1000);
    }

    public function join(twitchPlayer:TwitchPlayer) {
        twitchPlayer.twitchLobby = this;
    }

    public static function find(channelName:String):TwitchLobby {
        for (l in lobbyList) {
            if (l.name > channelName) throw "no lobby with channelName " + channelName + " found";
            if (l.name == channelName) return l;
        }
        throw "no lobby with channelName " + channelName + " found";
    }



}