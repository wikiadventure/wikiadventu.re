package controller.connect.error;

enum abstract ConnectError(Int) {
    var InvalidID = 100; //client error
    var NoLobbyFoundWithID;
    var LobbyFull;
    var InvalidPassword;
    var LobbyLimitReached = 200; //server error
    var PrivateLobbyLimitReached;
}