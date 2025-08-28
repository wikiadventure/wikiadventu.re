import type { WikiContentPreview } from "../composables/useWiki";
import type { LangCode } from "../i18n/lang";

export const VERSION = "0.1.0";

export type Game<Mode extends Gamemode = "Classic"> = {
    version: string,
    host_id: PlayerID,
    players: Record<PlayerID, Player>,
    // messages: Message[],
    gamemode: Mode,
    gamedata: Gamedata<Mode>
}

export const all_gamemode = ["Classic"] as const;
export type Gamemode = typeof all_gamemode[number];

export type Gamephase = "Waiting" | "Voting" | "Playing" | "RoundEnd" | "Podium";

export type ClassicGamephase = "Waiting" | "Voting" | "Playing" | "RoundEnd" | "Podium";

export type Timestamp = number;

export type RoundNumber = number;

/** Duration of a phase in seconds (-1 is infinite) */
export type PhaseDuration = number;

export type Gamedata<Mode extends Gamemode> = 
    Mode extends "Classic" ? {
        round: { 
            current: RoundNumber,
            max: RoundNumber
        },
        phase_duration: {
            [phase in ClassicGamephase]?: number
        },
        remaining_after_win_duration: number,
        wiki_page_pick_mode: WikiPagePickMode,
        wiki_random: {
            grnminsize: number,
            grnmaxsize: number,
        },
        wiki_lang: LangCode,
        round_data: {
            [round : number]: {
                wiki_lang: LangCode,
                start: RoundWikiPage,
                end: RoundWikiPage,
                remaining_after_win_duration: number,
                winners: {
                    [player_id: PlayerID]: {
                        timestamp: Timestamp,
                        score: number
                    }
                }
            }
        },
        gamephase: {
            [start:Timestamp]: {
                type: Gamephase,
                round: RoundNumber,
                duration: PhaseDuration
            }
        }
        player_data: {
            [id : PlayerID]: {
                [round : number]: {
                    twitch_votes: Record<string/*username*/, string/*raw vote*/>,
                    score: number,
                    vote_skip: boolean,
                    page_vote: VoteWikiPage | null,
                    history: Record<Timestamp,PageHistoryShard>
                }
            }
        },
    } : {}

export type PageHistoryShard = {
    id: number,
    title: string,
    redirect?: true
}

export const all_wiki_page_pick_mode = ["vote","random"] as const;
export type WikiPagePickMode = typeof all_wiki_page_pick_mode[number];

export type VoteWikiPage = WikiContentPreview;

export type RoundWikiPage = WikiContentPreview;

export type Player = {
    id: PlayerID,
    // peer_connection
    name: string,
    avatar: string,
    joinedAt: Timestamp,


}

export type PlayerID = string;

