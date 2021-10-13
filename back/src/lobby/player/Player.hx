package lobby.player;

import response.connect.ConnectionError.ConnectError;
import js.lib.Promise;
import config.Lang;
import uuid.Uuid;

class Player {
    public var socket:Ws;
    public var pseudo:String;
    public var uuid:String;//for authentification
    public var lang:Lang;
    public var score:Int=0;
    public var numberOfJump:Int=0;
    public var validationList:Array<PageValidation>;
    public var currentValidation(get, never):PageValidation;
    public var pageList(get, never):Array<String>;
    public var currentPage(get, set):String;
    public var validationBuffer:Array<Promise<String>>;//used to store validation of visited
    public var vote:String = "";
    public var voteSkip:Bool = false;
    public var id:Int;//for client identification
    public var alive:Bool;
    public function get_currentValidation() return validationList.length-1 < 0 ? null : validationList[validationList.length-1];
    public function get_pageList() return validationList.map((v) -> v.page);
    public function get_currentPage() return validationList.length-1 < 0 ? "" : validationList[validationList.length-1].page;
    public function set_currentPage(s:String) {validationList.push({page: s, validated: false}); return s;}
    public function validationListReset() validationList = [];

    public function new(pseudo:String, lang:Lang) {
        this.lang = lang;
        this.uuid = Uuid.v4();
        validationList = [];
        validationBuffer = [];
        if (pseudo==null || pseudo.length<3 || pseudo.length>26) throw ConnectError.InvalidPseudo;
        this.pseudo = pseudo;
    }

    public function assignSocket(socket:Ws):Bool {
        if (this.socket != null) return false;
        this.socket = socket;
        this.socket.on('pong', () -> alive = true);
        alive = true;
        return true;
    }

}

typedef PageValidation = {
    page:String,
    validated:Bool
}
