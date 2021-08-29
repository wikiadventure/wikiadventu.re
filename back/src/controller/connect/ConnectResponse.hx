package controller.connect;

import lobby.Lobby.LobbyType;
import config.Lang;

typedef ConnectResponse = {
    ?lobbyID:String,
    ?lobbyType:LobbyType,
    ?gameLoop:Int,
    ?slot:Int,
    ?playerID:String,
    ?lang:Lang
}