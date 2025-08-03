import type { Gamedata, Timestamp } from "../../game";

export function classic_initial_gamedata(timestamp?:Timestamp) {
    timestamp ??= Date.now();
    return {
        round: {
            current: 1,
            max: 3,
        },
        playphase_duration: 300,
        votephase_duration: 30,
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