import { ClientMessage } from "./message";
import { ClientResetVote } from "./resetVote";
import { ClientStart } from "./start";
import { ClientValidate } from "./validate";
import { ClientVote } from "./vote";
import { ClientVoteSkip } from "./voteSkip";

export type VanillaClientPacketType = 
ClientStart |
ClientMessage |
ClientVote |
ClientResetVote |
ClientValidate |
ClientVoteSkip;

export enum VanillaClientPacketTypeId {
    Start,
    Message,
    Vote,
    ResetVote,
    Validate,
    VoteSkip,
}
