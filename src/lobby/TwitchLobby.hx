package lobby;

import lobby.Lobby.LogType;
import haxe.Timer;
import twitch.HelixPrivilegedUser;
import twitch.HelixUser;
import twitch_chat_client.PrivateMessage;
import config.twitch.TwitchCredential;
import config.Lang;
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


    public function new(player:TwitchPlayer, passwordHash:String, slot:Int=15, round:Int=3, playTimeOut:Int=600, voteTimeOut:Int=30) {
        super(player.language, Twitch, passwordHash, slot, round, playTimeOut, voteTimeOut);
        twitchPlayerList = new Array<TwitchPlayer>();
        suggestionList = new Array<String>();
        name = player.twitchUser.name;
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
    public override function initNamespace(?name:String) {
        super.initNamespace(this.name);
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

    public function join(twitchPlayer:TwitchPlayer, passwordHash:String) {
        if (this.passwordHash != passwordHash) throw "invalid Password";
        twitchPlayer.twitchLobby = this;
        addPlayer(twitchPlayer);
    }

    public static function find(channelName:String):TwitchLobby {
        for (l in lobbyList) {
            if (l.name > channelName) throw "no lobby with channelName " + channelName + " found";
            if (l.name == channelName) return l;
        }
        throw "no lobby with channelName " + channelName + " found";
    }

    public override function log( data : Dynamic, logType:LogType, ?pos : haxe.PosInfos ) {
        var time = "[" + Date.now().toString() + "]";
		pos.fileName = time + "twitch lobby " + name + " " + logType + " -> " + pos.fileName;
        haxe.Log.trace(data, pos);
        var fileName = "twitchLobby/" + name + "/" + logType + ".log";
        var content = haxe.Log.formatOutput(data, pos);
        fileLog.Log.inFile(fileName, content);
	}

}