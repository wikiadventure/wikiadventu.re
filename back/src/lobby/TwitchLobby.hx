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
        id = 0;
        twitchPlayerList = new Array<TwitchPlayer>();
        suggestionList = new Array<String>();
        name = player.twitchUser.name;
        super(player.lang, Twitch, passwordHash, slot);
    }

    public override function insert() {
        var pos = lobbyList.length == 0 ? 0 : -search(name);
        //trick to also check -0
        if (1/(pos*0)==1/0) return lobbyList.insert(pos,this);
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
    //A advanced binary search
    public static function search(name:String){
        var start = 0;
        var len = lobbyList.length-1;
        var i=0x80000000;
        while (i!=0) {
            i >>>= 1;
            if ((len & i)!=0) {
                var noCBit = len & ~(i-1);
                len ^= (
                (len ^ (noCBit-1)) & 
                ((lobbyList[start+noCBit] != null && lobbyList[start+noCBit].name <= name ? 1 : 0) - 1 >>>0)
                );
            }
        }
        if (lobbyList[start+len].name != name) {
          return -1 - start - len |0;
        }
        return start + len |0;
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