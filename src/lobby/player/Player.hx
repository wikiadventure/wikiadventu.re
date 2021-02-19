package lobby.player;

import js.lib.Promise;
import config.Lang;
import uuid.Uuid;

class Player {
    public var socket:Ws;
    public var pseudo:String;
    public var uuid:String;//for authentification
    public var language:Lang;
    public var score:Int=0;
    public var numberOfJump:Int=0;
    public var pageList:Array<String>;
    public var currentPage(get, set):String;
    public var validationBuffer:Array<Promise<String>>;//used to store validation of visited
    public var vote:String;
    public var voteSkip:Bool;
    public var id:Int;//for client identification
    public var alive:Bool;

    public function get_currentPage() return pageList.length-1 < 0 ? "" : pageList[pageList.length-1];
    public function set_currentPage(s:String) {pageList.push(s); return s;}
    public function pageListReset() pageList = [];

    public function new(pseudo:String, language:Lang) {
        this.language = language;
        this.uuid = Uuid.v4();
        pageList = [];
        validationBuffer = [];
        var dangerRegex : EReg =  ~/[<>:|%$\/\\]/g;
        if (pseudo==null || pseudo=="" || pseudo.length<3 || pseudo.length>26 || dangerRegex.match(pseudo)) throw "invalid player name";
        else this.pseudo = pseudo;
    }

    public function assignSocket(socket:Ws):Bool {
        if (this.socket != null) return false;
        this.socket = socket;
        this.socket.on('pong', () -> alive = true);
        alive = true;
        return true;
    }

}