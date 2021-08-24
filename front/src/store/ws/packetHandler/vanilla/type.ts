import { WsGamePhase } from "./gamePhase";
import { WsMessage } from "./message";
import { WsPath } from "./path";
import { WsPlayerJoin } from "./playerJoin";
import { WsPlayerLeft } from "./playerLeft";
import { WsRollback } from "./rollback";
import { WsSetOwner } from "./setOwner";
import { WsUpdateScore } from "./updateScore";
import { WsVoteResult } from "./voteResult";
import { WsVoteSkip } from "./voteSkip";
import { WsWinRound } from "./winRound";

export type VanillaPacketType = WsGamePhase | WsMessage | WsPath | WsPlayerJoin | WsPlayerLeft | WsRollback | WsSetOwner | WsUpdateScore | WsVoteResult | WsVoteSkip | WsWinRound;

export enum VanillaPacketTypeId {
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