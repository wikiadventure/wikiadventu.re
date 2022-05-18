export enum ServerPacketType {
    CurrentPlayers,
    PlayerJoin, 
    PlayerLeft,
    State,
    UpdateScore,
    Message,
    SetOwner,
    VoteSkip,
    UpdateTimer,

    GameMode,//current gameMode specific packet
    GamePhase,//current gamePhase specific packet

}

export type ServerPacket = {
    type:ServerPacketType
}
