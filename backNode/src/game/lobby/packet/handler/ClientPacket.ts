export enum VanillaClientPacketType {
    Start,
    Message,
    Vote,
    ResetVote,
    Validate,
    VoteSkip,
}

export enum ModClientPacketType {

}
type ClientPacketType = VanillaClientPacketType | ModClientPacketType;

typedef ClientPacket = {
    type:ClientPacketType
}
