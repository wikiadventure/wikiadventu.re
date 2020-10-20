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
  }

class LangTools {

    public static function getName(language:Lang):String {
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

    public static function getVotePlaceholder(language:Lang):String {
        return switch language {
            case en: "Send your wiki page title suggestion";
            case fr: "Envoyez votre suggestion de titre de page wiki";
            case de: "Senden Sie Ihren Wiki-Seitentitelvorschlag";
            case es: "Send your wiki page title suggestion";
            case it: "Send your wiki page title suggestion";
            case eo: "Send your wiki page title suggestion";
            case pt: "Send your wiki page title suggestion";
        }
    }

    public static function getVotePlaceholderSubmitted(language:Lang):String {
        return switch language {
            case en: "Your suggestion will override the previous one";
            case fr: "Votre suggestion remplacera la précédente";
            case de: "Ihr Vorschlag überschreibt den vorherigen";
            case es: "Your suggestion will override the previous one";
            case it: "Your suggestion will override the previous one";
            case eo: "Your suggestion will override the previous one";
            case pt: "Your suggestion will override the previous one";
        }
    }

    public static function getChatPlaceholder(language:Lang):String {
        return switch language {
            case en: "Send a message to the lobby";
            case fr: "Envoyez un message au lobby";
            case de: "Senden Sie eine Nachricht an die Lobby";
            case es: "Send a message to the lobby";
            case it: "Send a message to the lobby";
            case eo: "Send a message to the lobby";
            case pt: "Send a message to the lobby";
        }
    }
    public static function getSocketError(language:Lang):String {
        return switch language {
            case en: "Real-time connection encountered a problem";
            case fr: "La connection temps réel a rencontré un problème";
            case de: "Bei der Echtzeitverbindung ist ein Problem aufgetreten";
            case es: "Real-time connection encountered a problem";
            case it: "Real-time connection encountered a problem";
            case eo: "Real-time connection encountered a problem";
            case pt: "Real-time connection encountered a problem";
        }
    }

    public static function getExitWarning(language:Lang):String {
        return switch language {
            case en: "Are you sure you want to exit? You will lose your session.";
            case fr: "Êtes-vous sûr de vouloir quitter? Vous perdrez votre session.";
            case de: "Sie sind sicher, dass Sie beenden wollen? Sie werden Ihre Sitzung verlieren.";
            case es: "Are you sure you want to exit? You will lose your session.";
            case it: "Are you sure you want to exit? You will lose your session.";
            case eo: "Are you sure you want to exit? You will lose your session.";
            case pt: "Are you sure you want to exit? You will lose your session.";
        }
    }
    public static function getVote(language:Lang):String {
        return switch language {
            case en: "Your vote";
            case fr: "votre vote";
            case de: "Your vote";
            case es: "Your vote";
            case it: "Your vote";
            case eo: "Your vote";
            case pt: "Your vote";
        }
    }

    public static function getStartPage(language:Lang):String {
        return switch language {
            case en: "Start page";
            case fr: "Page de début";
            case de: "Startseite";
            case es: "Start page";
            case it: "Start page";
            case eo: "Start page";
            case pt: "Start page";
        }
    }

    public static function getEndPage(language:Lang):String {
        return switch language {
            case en: "End page";
            case fr: "Page de fin";
            case de: "Endseite";
            case es: "End page";
            case it: "End page";
            case eo: "End page";
            case pt: "End page";
        }
    }

    public static function getURL(language:Lang):String {
        return language + ".wikipedia.org";
    }

    public static function getApiURL(language:Lang):String {
        return language + ".wikipedia.org/api/rest_v1/page/html/";
    }

}