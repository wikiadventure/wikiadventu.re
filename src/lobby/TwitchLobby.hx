package lobby;

import config.twitch.TwitchCredential;
import controller.TwitchController.TwitchUser;
import haxe.Timer;
import twitch_js.ClientOptions;
import config.Language;
import lobby.Lobby.LobbyType;
import twitch_js.Client;
import twitch_js.Listener;

class TwitchLobby extends Lobby {

    public static var lobbyList:Array<TwitchLobby>;

    public static var suggestionLimit:Int = 100;

    public var channelName:String;
    public var suggestionList:Array<String>;
    public var twitchBot:Client;


    public function new(user:TwitchUser, language:Language, type:LobbyType, ?passwordHash:String, slot:Int=15, round:Int=3, playTimeOut:Int=600, voteTimeOut:Int=30) {
        super(language, Private, passwordHash, slot, round, playTimeOut, voteTimeOut);
        this.channelName = user.display_name;
        suggestionList = new Array<String>();
        var options:ClientOptions = {
            identity: {
                username: TwitchCredential.botUsername,
                password: TwitchCredential.botPassword
            },
            channels: [
                channelName
            ]
        }
        twitchBot = new Client(options);

        
        twitchBot.on('message', chatMessageHandler);
        twitchBot.on('connected', onConnectedHandler);
        twitchBot.connect();

    }

    public static function init() {
        lobbyList = new Array<TwitchLobby>();
    }

    /**
     * the id of the lobby is the channel name of the streamer
     */
    public override function giveID() {
        var pos = 0;
        while ( lobbyList[pos] != null && this.channelName > lobbyList[pos].channelName) {
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
        twitchBot.say(channelName, "Vote phase open! You can vote for a wiki page with command !vote YourVote");
        state = Voting;
        initNewPhase();
        if (loop != null) loop.stop();
        loop = Timer.delay(function () {
            twitchBot.say(channelName, "Vote phase closed!");
            selectPage(suggestionList);
        },currentStateTimeOut()*1000);
    }

    public function chatMessageHandler(target:String, context:String, msg:String, self:Bool) {
        if (self) return;
        if (msg.length > 231) return;
        msg = StringTools.trim(msg);
        if (StringTools.startsWith(msg, "!vote ") && state == Voting) {
            log("someone is voting : ", Info);
            if (suggestionList.length < suggestionLimit) {
                var title = msg.substr(6);
                suggestionList.push(title);
                log(title, Info);
            }
            return;
        } 
        
    }

    function onConnectedHandler (addr:String, port:String) {
        log("Connected to " + addr + ":" + port, Info);
        twitchBot.say(channelName, channelName + " just launch a game of wiki adventure!");
        twitchBot.say(channelName, "Vote phase open! You can vote for a wiki page with command !vote YourVote");
    }

    public static function find(channelName:String):TwitchLobby {
        for (l in lobbyList) {
            if (l.channelName > channelName) throw "no lobby with channelName " + channelName + " found";
            if (l.channelName == channelName) return l;
        }
        throw "no lobby with channelName " + channelName + " found";
    }



}