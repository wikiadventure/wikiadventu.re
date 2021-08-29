package lobby.packet.handler;

import lobby.player.Player;

enum abstract VanillaClientPacketType(Int) from Int to Int {
    var Start;
    var Message;
    var Vote;
    var ResetVote;
    var Validate;
    var VoteSkip;
}

enum abstract ModClientPacketType(Int) from Int to Int {

}

enum abstract ClientPacketType(Int) from VanillaClientPacketType to Int from ModClientPacketType to Int {}

typedef ClientPacket = {
    type:ClientPacketType
}
