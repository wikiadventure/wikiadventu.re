export enum ClientPacketType {
    Start,
    Message,
    Vote,
    ResetVote,
    Validate,
    VoteSkip,
    
    GameMode,//current gameMode specific packet
    GamePhase,//current gamePhase specific packet
}


export type ClientPacket = {
    type:ClientPacketType
}
