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
export type ClientPacketType = VanillaClientPacketType | ModClientPacketType;


export type ClientPacket = {
    type:ClientPacketType
}
export enum VanillaInternalPacketType {
    ValidationSucess = 2000,
    ValidationFailed
}

export enum ModInternalPacketType {

}

export type InternalPacketType = ClientPacketType | VanillaInternalPacketType | ModInternalPacketType;

export type InternalPacket = {
    type: InternalPacketType
}
