package controller.connect.error;

enum abstract ConnectError(Int) from Int to Int {
    var InvalidID = 100; //client error
    var NoLobbyFoundWithID;
    var NoLobbyFoundWithChannelName;
    var LobbyFull;
    var InvalidPassword;
    var LobbyLimitReached = 200; //server error
    var PrivateLobbyLimitReached;
}