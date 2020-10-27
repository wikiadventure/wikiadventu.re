package controller.connect;

import lobby.Lobby.LobbyType;
import config.Lang;

typedef ConnectionResponse = {
    status:ConnectionStatus,
    lobbyID:String,
    lobbyType:LobbyType,
    playerID:String,
    lang:Lang,
    ?error:String
}

enum abstract ConnectionStatus(String) {
    var Success;
    var ClientError;
    var ServerError;
}