package lobby;

import controller.connect.error.ConnectError;
import lobby.player.Player;
import js.node.Timers;
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

    public function new(player:TwitchPlayer, passwordHash:String, slot:Int=15) {
        super(player.language, Twitch, passwordHash, slot);
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
    
    public function join(twitchPlayer:TwitchPlayer, passwordHash:String) { 
        if (this.passwordHash != passwordHash) throw ConnectError.InvalidPassword;
        twitchPlayer.twitchLobby = this;
        twitchPlayer.twitchBot.quit();
        if (twitchPlayerList.indexOf(twitchPlayer) == -1) twitchPlayerList.push(twitchPlayer);
        addPlayer(twitchPlayer);
    }

    public override function removePlayer(player:Player) {
        super.removePlayer(player);
        try {
            var t = cast(player, TwitchPlayer);
            if (twitchPlayerList.remove(t)) {
                t.twitchBot.quit();
                if (t.twitchUser.name == name) {
                    delete();
                }
            }
        } catch(e:Dynamic) {
        }
    }

    public static function find(channelName:String):TwitchLobby {
        for (l in lobbyList) {
            if (l.name > channelName) break;
            if (l.name == channelName) return l;
        }
        throw ConnectError.NoLobbyFoundWithID;
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