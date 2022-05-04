enum VanillaServerPacketType {
    PlayerJoin,
    PlayerLeft,
    VoteResult,
    GamePhase,
    UpdateScore,
    WinRound,
    Message,
    SetOwner,
    Path,
    VoteSkip,
    Rollback,
}

enum ModServerPacketType {

}

type ServerPacketType = VanillaServerPacketType | ModServerPacketType;

type ServerPacket = {
    type:ServerPacketType
}
