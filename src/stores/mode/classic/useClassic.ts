import { computed, ref, watch } from "vue";
import { useGameStore } from "../../useGameStore";
import { useTimestamp } from "@vueuse/core";
import type { PlayerID, VoteWikiPage } from "../../game";
import { getRandomPage } from "../../../composables/useWiki";


export function useClassicGameStore() {
    const gameStore = useGameStore();
    const { 
        latestTimestamp, my_player_round_data, current_round, current_phase_start, current_phase
    } = gameStore;

    const currentWikiPage = computed(() => {
        const t = latestTimestamp(my_player_round_data.value.history);
        return my_player_round_data.value.history[t];
    });

    const currentEndPage = computed(() => {
        return current_round.value.end;
    });

    const timestamp = useTimestamp({ offset: 0 });

    const rawCountDown = computed(() => {
        return ((current_phase_start.value + current_phase.value.duration*1000) - timestamp.value);
    });

    const countDown = computed(() => {
        return Math.max(Math.ceil(rawCountDown.value / 1000), 0);
    });

    return {
        ...gameStore,
        currentWikiPage,
        currentEndPage,
        rawCountDown,
        countDown
    }
}

let is_startWithVote_running = false;

export function useClassicGameLifeCycle() {
    const {
        rawCountDown,
        isHost,
        current_phase,
        current_round,
        store,
    } = useClassicGameStore();

    const open_podium = ref(false);

    function win(player_id:PlayerID) {
        store.gamedata.round_data[store.gamedata.round.current].winner = player_id;
        const t = Date.now();
        store.gamedata.gamephase[t] = {
            duration: 10,
            round: store.gamedata.round.current,
            type: "RoundEnd"
        }
    }

    async function startWithVote() {
        if (is_startWithVote_running) return;
        is_startWithVote_running = true;
        const round_wiki_lang = store.gamedata.wiki_lang;
        let votes = Object.values(store.gamedata.player_data)
            .reduce<VoteWikiPage[]>((acc,p) => {
                const player_round_data = p[store.gamedata.round.current];
                if(player_round_data.page_vote == null) return acc;
                if(player_round_data.page_vote.wiki_lang != round_wiki_lang) return acc;
                acc.push(player_round_data.page_vote);
                return acc;
            }, []);
        if (votes.length < 2) {
            try {
                const pages = await getRandomPage(round_wiki_lang,2 - votes.length);
                votes.push(...pages);
            } catch(e) {
                setTimeout(()=>is_startWithVote_running = false, 5000);
                is_startWithVote_running = false;
                return;
            }
        }
        // pick random vote 
        const start = votes[Math.floor(Math.random() * votes.length)];
        votes = votes.filter(v=>start.id!=v.id);
        if (votes.length < 1) {
            try {
                const pages = await getRandomPage(round_wiki_lang,2 - votes.length);
                votes.push(...pages);
            } catch(e) {
                setTimeout(()=>is_startWithVote_running = false, 5000);
                is_startWithVote_running = false;
                return;
            }
        }
        const timestamp = Date.now();
        const end = votes[Math.floor(Math.random() * votes.length)];
        current_round.value = {
            wiki_lang: store.gamedata.wiki_lang,
            start,
            end
        }
        for (const player of Object.values(store.players)) {
            store.gamedata.player_data[player.id] ??= {};
            store.gamedata.player_data[player.id][store.gamedata.round.current] ??= { score: 0 , page_vote: null, history: {} };
            store.gamedata.player_data[player.id][store.gamedata.round.current].history[timestamp] = {
                id: start.id,
                title: start.title,
            }
        }
        store.gamedata.gamephase[timestamp] = {
            duration: store.gamedata.playphase_duration,
            round: store.gamedata.round.current,
            type: "Playing",
            // @ts-ignore
            FROM: "START with vote"
        }
        is_startWithVote_running = false;
    }


    watch(rawCountDown, (_newValue, _oldValue) => {
        if (!isHost.value) return;
        if (current_phase.value.type == "Voting") {
            if (rawCountDown.value <= 0) {
                startWithVote();
            }
        } else if (current_phase.value.type == "Playing") {
            if (rawCountDown.value <= 0) {
                const t = Date.now();
                store.gamedata.gamephase[t] = {
                    duration: 10,
                    round: store.gamedata.round.current,
                    type: "RoundEnd"
                }
            }
        } else if (current_phase.value.type == "RoundEnd") {
            if (rawCountDown.value <= 0) {
                const t = Date.now();
                if ((store.gamedata.round.current+1) > store.gamedata.round.max) {
                    open_podium.value = true;
                    store.gamedata.gamephase[t] = {
                    duration: -1,
                    round: store.gamedata.round.current,
                    type: "Podium"
                    }
                    return 
                }
                store.gamedata.round.current++;
                store.gamedata.gamephase[t] = {
                    duration: -1,
                    round: store.gamedata.round.current,
                    type: "Waiting"
                }
                const controlScreen = document.querySelector(".control-screen.mode-classic");
                controlScreen?.scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});
                
            }
        }
    });

    watch(() => current_phase.value.type, (newValue, _oldValue) => {
        if (newValue == "Playing") {
            const playArea = document.getElementById("play-area");
            playArea?.scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});
        }
    });

    watch(() => current_phase.value.type, (phase, _oldValue) => {
        if (phase == "Voting") {
            const controlScreen = document.querySelector(".control-screen.mode-classic");
            controlScreen?.scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});
        } else if (phase == "Playing") {
            const playArea = document.getElementById("play-area");
            playArea?.scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});
        } else if (phase == "Waiting") {
            const controlScreen = document.querySelector(".control-screen.mode-classic");
            controlScreen?.scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});
        }
    });

    watch(() => store.gamedata.player_data, (_newValue, _oldValue) => {
        if (current_phase.value.type !== "Playing" || !isHost.value) return;

        const round = store.gamedata.round.current;
        const endPageTitle = store.gamedata.round_data[round].end.title;

        for (const player_id in store.gamedata.player_data) {
            const history = store.gamedata.player_data[player_id][round]?.history;
            if (!history) continue;

            const timestamps = Object.keys(history).map(Number);
            if (timestamps.length === 0) continue;

            const latestTimestamp = Math.max(...timestamps);
            const latestPage = history[latestTimestamp];

            if (latestPage && latestPage.title === endPageTitle) {
                win(player_id as PlayerID);
            }
        }
    }, { deep: true });

    return {
        open_podium
    }

}