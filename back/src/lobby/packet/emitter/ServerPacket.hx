package lobby.packet.emitter;

enum abstract VanillaServerPacketType(Int) from Int to Int {
    var PlayerJoin;
    var PlayerLeft;
    var VoteResult;
    var GamePhase;
    var UpdateScore;
    var WinRound;
    var Message;
    var SetOwner;
    var Path;
    var VoteSkip;
    var Rollback;
}

enum abstract ModServerPacketType(Int) from Int to Int {

}

enum abstract ServerPacketType(Int) from VanillaServerPacketType to Int from ModServerPacketType to Int {}

typedef ServerPacket = {
    type:ServerPacketType
}
