package lobby;

enum abstract LoginType(String) {
    var PublicJoin;
    var PrivateCreate;
    var PrivateJoin;
    var TwitchCreate;
    var TwitchJoinWith;
    var TwitchJoinWithout;
}