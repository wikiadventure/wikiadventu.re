package controller.info;

import lobby.Lobby.LobbyState;
import lobby.Lobby.LobbyType;
import config.Lang;

typedef InfoResponse = {
    status:InfoStatus,
    ?lobbyID:String,
    ?lobbyType:LobbyType,
    ?lobbyLang:Lang,
    ?slot:Int,
    ?players:Int,
    ?state:LobbyState,
    ?error:String
}

enum abstract InfoStatus(String) {
    var Found;
    var NotFound;
    var ServerError;
}