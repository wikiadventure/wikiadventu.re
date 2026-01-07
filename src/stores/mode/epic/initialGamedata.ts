import type { Gamedata, RoundNumber, Timestamp } from "../../game";
import { getSyncedTimestamp } from "../../syncedStore";

export function epic_initial_gamedata(timestamp?:Timestamp):Gamedata<"Epic"> {
    timestamp ??= getSyncedTimestamp();
    return {
        round: {
            current: 1 as RoundNumber,
            max: 3 as RoundNumber,
        },
        phase_duration: {
            Playing: {
                value: 5,
                unit: "minutes"
            },
            Voting: {
                value: 30,
                unit: "seconds"
            },
            RoundEnd: {
                value: 5,
                unit: "seconds"
            },
        },
        remaining_after_win_duration: {
            value: 0,
            unit: "seconds"
        },
        pages_pool_size: 3,
        pages_found_to_win: 3,
        pages_pool_order_mandatory: true,
        gamephase: {
            [timestamp]: {
                type: "Waiting",
                round: 1 as RoundNumber,
                duration: -1,
            }
        },
        wiki_page_pick_mode: "random",
        wiki_random: {
            grnminsize: -1,
            grnmaxsize: -1,
        },
        wiki_lang: "en",
        round_data: {
            
        },
        player_data: {

        },
    } ;
}