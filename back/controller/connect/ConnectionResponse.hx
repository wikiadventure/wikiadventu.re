package controller.connect;

import lobby.Lobby.LobbyType;
import config.Lang;

typedef ConnectionResponse = {
    status:ConnectionStatus,
    ?lobbyID:String,
    ?lobbyType:LobbyType,
    ?gameMode:Int,
    ?slot:Int,
    ?playerID:String,
    ?lang:Lang,
    ?errorCode:Int
}

enum abstract ConnectionStatus(String) {
    var Success;
    var Error;
}