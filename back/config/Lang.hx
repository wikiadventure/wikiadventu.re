package config;

//TODO add your language

enum abstract Lang(String) {
    var en;//english
    var fr;//french
    var de;//german
    var es;//spanish
    var it;//italian
    var eo;//esperanto
    var pt;//portugues
    var el;//Greek
  }

class LangTools {

    public static function getName(l:Lang):String {
        return switch l {
            case en: "English";
            case fr: "Français";
            case de: "Deutsch";
            case es: "Español";
            case it: "italiano";
            case eo: "Esperanto";
            case pt: "Português";
            case el: "Eλληνικά";
            default: "Unknown";
        }
    }

    public static function getURL(language:Lang):String {
        return language + ".wikipedia.org";
    }

    public static function getTwitchVoteOpen(l:Lang):String {
        return switch l {
            case fr: "La phase de vote est désormais ouverte. Utiliser la commande !vote titre";
            default: "The voting phase is now open! Use the command !vote title";
        }
    }

    public static function getTwitchVoteClose(l:Lang):String {
        return switch l {
            case fr: "La phase de vote est désormais clos!";
            default: "The voting phase is now closed!";
        }
    }
    public static function getTwitchVoteCap(l:Lang):String {
        return switch l {
            case fr: "Limite de vote Twitch atteinte!";
            default: "Twitch vote cap reached!";
        }
    }

}