package lobby;

enum abstract LoginType(Int) {
    var PublicJoin;
    var PrivateCreate;
    var PrivateJoin;
    var TwitchCreate;
    var TwitchJoinWith;
    var TwitchJoinWithout;
}