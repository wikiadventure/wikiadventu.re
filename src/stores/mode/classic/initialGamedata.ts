import type { Gamedata, Timestamp } from "../../game";

export function classic_initial_gamedata(timestamp?:Timestamp) {
    timestamp ??= Date.now();
    return {
        round: {
            current: 1,
            max: 3,
        },
        phase_duration: {
            Playing: 300,
            Voting: 30,
            RoundEnd: 5,
        },
        remaining_after_win_duration: 0,
        gamephase: {
            [timestamp]: {
                type: "Waiting",
                round: 1,
                duration: -1,
            }
        },
        wiki_page_pick_mode: "random",
        wiki_lang: "en",
        round_data: {
            
        },
        player_data: {

        },
    } as Gamedata<"Classic">;
}