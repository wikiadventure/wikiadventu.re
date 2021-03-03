package controller.info;

import lobby.gameLoop.Phase.PhaseType;
import lobby.Lobby.LobbyType;
import config.Lang;

typedef InfoResponse = {
    status:InfoStatus,
    ?lobbyID:String,
    ?lobbyType:LobbyType,
    ?gameMode:Int,
    ?gamePhase:Int,
    ?lobbyLang:Lang,
    ?slot:Int,
    ?players:Int,
    ?error:String
}

enum abstract InfoStatus(String) {
    var Found;
    var NotFound;
    var ServerError;
}