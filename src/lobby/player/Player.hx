package lobby.player;

import config.Language;
import js.node.net.Socket;
import config.randomName.EnglishNameGenerator;
import js.npm.Uuid;

class Player {
    public var connection:Socket;
    public var pseudo:String;
    public var uuid:String;
    public var language:Language;
    public var score:Int=0;
    public var numberOfJump:Int=0;

    public function new(connection:Socket, pseudo:String, language:Language) {
        this.connection = connection;
        this.language = language;
        var dangerRegex : EReg =  ~/[^<>%$]/g;
        if ( pseudo == null || pseudo == "") {
            this.pseudo = randomNameGenerator(this.language);
        } else if ( pseudo.length < 6 || !dangerRegex.match(pseudo) ) {
            throw "Invalid Pseudo, pseudo need to be at least 6 character and can't use any of this character < > % $ ";
        } else {
            this.pseudo = pseudo;
        }
        this.uuid = Uuid.v4();

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