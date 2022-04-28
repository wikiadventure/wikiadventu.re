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

//@ts-ignore
type ClientPacket = {
    type:ClientPacketType
}
