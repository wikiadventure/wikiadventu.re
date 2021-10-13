package lobby;

import response.connect.ConnectionError.ConnectError;
import lobby.player.Player;
import lobby.Lobby.LogType;
import lobby.player.TwitchPlayer;
using config.twitch.TwitchBotExtension;

class TwitchLobby extends Lobby {

    public static var lobbyList:Array<TwitchLobby> = [];
    public static var suggestionLimit:Int = 100;
    
    public var name:String;
    public var twitchPlayerList:Array<TwitchPlayer>;
    public var suggestionList:Array<String>;

    public function new(player:TwitchPlayer, passwordHash:String, slot:Int=15) {
        super(player.lang, Twitch, passwordHash, slot);
        id = 0;
        twitchPlayerList = new Array<TwitchPlayer>();
        suggestionList = new Array<String>();
        name = player.twitchUser.name;
    }

    public override function insert() {
        var pos = -search(name);
        if (pos >= 0) return lobbyList.insert(pos,this);
        throw ConnectError.TwitchIdAlreadyUsed;
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
     public inline static function search(name:String) {
        return s(name,0,lobbyList.length-1);
    }   

    private static function s(name:String,l:Int, r:Int) {
        if (r >= l) {
            var mid = l + Math.floor((r - l) / 2);
            if (lobbyList[mid].name == name) return mid;
            if (lobbyList[mid].name > name) return s(name, l, mid - 1);
            return s(name, mid + 1, r);
        }
        return -r;
    }

    public static function find(name:String) {
        var pos = search(name);
        if (pos >= 0) return lobbyList[pos];
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