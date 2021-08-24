package lobby.player;

using Lambda;

class PlayersExtension {

    public static function pageHistoryReset(players:Players) {
        players.iter(p -> p.validationListReset());
    }

    public static function voteReset(players:Players) {
        players.iter(p -> p.vote = "");
    }

    public static function setStartPage(players:Players, startPage:String) {
        players.iter(p -> p.validationList.push({page: startPage, validated: true}));
    }

    public static function resetScore(players:Players) {
        players.iter(p -> p.score = 0);
    }

}
