package controller.connect;

import lobby.Lobby.LobbyType;
import config.Lang;

typedef ConnectionResponse = {
    ?lobbyID:String,
    ?lobbyType:LobbyType,
    ?gameMode:Int,
    ?slot:Int,
    ?playerID:String,
    ?lang:Lang
}