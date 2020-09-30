package lobby.player;

import config.Language;
import js.node.socketio.Socket;
import config.randomName.EnglishNameGenerator;
import js.npm.Uuid;

class Player {
    public var socket:Socket;
    public var pseudo:String;
    public var uuid:String;//for authentification
    public var language:Language;
    public var score:Int=0;
    public var numberOfJump:Int=0;
    public var currentPage:String;
    public var votingSuggestion:String;
    public var id:Int;//for client identification

    public function new(pseudo:String, language:Language) {
        this.language = language;
        var dangerRegex : EReg =  ~/[<>:|%$\/\\]/g;
        if ( pseudo == null || pseudo == "") {
            this.pseudo = randomNameGenerator(this.language);
        } else if ( pseudo.length < 6 || dangerRegex.match(pseudo) || pseudo.length > 26 ) {
            throw "Invalid Pseudo, pseudo need to be at least 6 character, no more than 25 character and can't use any of this character < > : | % $ / \\";
        } else {
            this.pseudo = pseudo;
        }
        this.uuid = Uuid.v4();

    }

    public function assignSocket(socket:Socket):Bool {
        if (this.socket != null) {
            return false;
        }
        this.socket = socket;
        return true;
    }

    //suggest your own language random name generator
    public static function randomNameGenerator(l:Language):String {
        switch l {
            case en: return EnglishNameGenerator.getInstance().getRandomName();
            case fr: return "anonymous";
            case de: return "anonymous";
            case es: return "anonymous";
            case it: return "anonymous";
            case eo: return "anonymous";
            case pt: return "anonymous";
        }
    }

}