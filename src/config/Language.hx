package config;

//TODO add your language

enum abstract Language(String) from String to String {
    var en;//english
    var fr;//french
    var de;//german
    var es;//spanish
    var it;//italian
    var eo;//esperanto
    var pt;//portugues
  }

class LanguageTools {

    public static function getName(language:Language):String {
        return switch language {
            case en: "English";
            case fr: "Français";
            case de: "Deutsch";
            case es: "Español";
            case it: "italiano";
            case eo: "Esperanto";
            case pt: "Português";
        }
    }

    public static function getURL(language:Language):String {
        return language + ".wikipedia.org";
    }

}