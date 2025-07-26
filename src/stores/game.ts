
export type Game<Mode extends Gamemode = "Classic"> = {
    version: string,
    host_id: PlayerID,
    players: Record<PlayerID, Player>,
    // messages: Message[],
    gamemode: Mode,
    gamephase: Gamephase,
    gamedata: Gamedata<Mode>
}

export const all_gamemode = ["Classic"] as const;
export type Gamemode = typeof all_gamemode[number];

export type Gamephase = "Waiting" | "Playing" | "RoundEnd" | "Podium";

export type Gamedata<Mode extends Gamemode> = 
    Mode extends "Classic" ? {
        round: { 
            current: number,
            max: number
        },
        gamephase_start: number,
        gamephase_duration: number,
        round_data: {
            [round : number]: {
                start: RoundWikiPage,
                end: RoundWikiPage
            }
        },
        player_data: {
            [id : PlayerID]: {
                [round : number]: {
                    score: number,
                    history: PageHistoryShard[]
                }
            }
        },
        syncWikiPage: string
    } : {}

export type PageHistoryShard = {
    timestamp: number,
    id: number,
    title: string
}

export type RoundWikiPage = string; // title

export type Player = {
    id: PlayerID,
    // peer_connection
    name: string,
    avatar: string,

}

export type PlayerID = string;

type Message = {
    player_id:PlayerID,
    timestamp:number,
    content:string
}
