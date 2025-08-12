import { computed, ref, watch } from "vue";
import { useGameStore } from "../../useGameStore";
import { useTimestamp } from "@vueuse/core";
import type { ClassicGamephase, PlayerID, VoteWikiPage } from "../../game";
import { findWikiPreviewStream, getRandomPage, type WikiContentPreview } from "../../../composables/useWiki";
import { twitch_client_id, twitch_oauth_scope, twitch_oauth_token } from "../../../composables/useTwitch";
import { ChatClient } from "@twurple/chat";
import { StaticAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";
import { player_id } from "../../form";
import { shuffleObjectKeys } from "../../../composables/numberUtils";

let classicGameStore:ReturnType<typeof useClassicInnerGameStore> | null = null;

export function useClassicGameStore() {
    if (classicGameStore != null) return classicGameStore;
    classicGameStore = useClassicInnerGameStore();
    return classicGameStore;
}


function useClassicInnerGameStore() {
    const gameStore = useGameStore();
    const { 
        latestTimestamp, my_player_round_data, current_round, current_phase_start, current_phase, store, connectedPlayerIds
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

    const current_round_all_player_data = computed(() => {
        return Object.entries(store.gamedata.player_data).map(([id,p])=>({
            player_id: id,
            ...(p[store.gamedata.round.current])
        }))
    });

    const current_round_player_data = computed({
        get: () => {
            store.gamedata.player_data[player_id.value] ??= {};
            store.gamedata.player_data[player_id.value][store.gamedata.round.current] ??= {
                twitch_votes: {}, score: 0, vote_skip: false, page_vote: null, history: {}
            };
            return store.gamedata.player_data[player_id.value][store.gamedata.round.current];
        },
        set: (value) => {
            store.gamedata.player_data[player_id.value] ??= {};
            // store.gamedata.player_data[player_id.value][store.gamedata.round.current] ??= {
            //     twitch_votes: {}, score: 0, vote_skip: false, page_vote: null, history: {}
            // };
            store.gamedata.player_data[player_id.value][store.gamedata.round.current] = value
        }
    });

    const current_round_connected_player_data = computed(() => {
        return current_round_all_player_data.value.filter(({ player_id }) => connectedPlayerIds.has(player_id));
    });

    const first_win_of_round_timestamp = computed(() => {
        return Object.entries(store.gamedata.round_data[store.gamedata.round.current]?.winners ?? {})
            .reduce((min,[_id,x])=> x.timestamp < min ? x.timestamp : min, Number.MAX_SAFE_INTEGER);
    });

    const rawRemainCountDown = computed(() => {
        return ((first_win_of_round_timestamp.value + (current_round.value?.remaining_after_win_duration ?? 0)*1000) - timestamp.value);
    });

    const remainCountDown = computed(() => {
        return rawRemainCountDown.value < rawCountDown.value ? rawRemainCountDown.value : rawCountDown.value;
    });
    
    const remainCountDownSeconds = computed(() => {
        return Math.max(Math.ceil(remainCountDown.value / 1000), 0);
    });
    

    function changeGamephase(next_phase:ClassicGamephase, timestamp?:number, round?:number, duration?:number) {
        timestamp ??= Date.now();
        store.gamedata.gamephase[timestamp] = {
            duration: duration ?? store.gamedata.phase_duration[next_phase] ?? -1,
            round: round ?? store.gamedata.round.current,
            type: next_phase
        }
    }

    async function start() {
        const timestamp = Date.now();
        if (store.gamedata.wiki_page_pick_mode == "vote") {
            // TODO clean this
            // @ts-ignore
            current_round.value = {
                wiki_lang: store.gamedata.wiki_lang,
            }
            changeGamephase("Voting", timestamp);
            return;
        }
        const [ start, end ] = await getRandomPage(store.gamedata.wiki_lang, 2);
        current_round.value = {
            wiki_lang: store.gamedata.wiki_lang,
            remaining_after_win_duration: store.gamedata.remaining_after_win_duration,
            winners: {},
            start,
            end
        }
        for (const player of Object.values(store.players)) {
            store.gamedata.player_data[player.id] ??= {};
            store.gamedata.player_data[player.id][store.gamedata.round.current] ??= {
                twitch_votes: {}, score: 0, vote_skip: false, page_vote: null, history: {}
            };
            store.gamedata.player_data[player.id][store.gamedata.round.current].history[timestamp] = {
                id: start.id,
                title: start.title,
            }
        }
        changeGamephase("Playing");
    }
    
    async function startWithVote() {
        if (is_startWithVote_running) return;
        is_startWithVote_running = true;
        if (current_round_connected_player_data.value.find(x=>Object.keys(x.twitch_votes).length > 0)) {
            try {
                await startWithTwitchVote();
            } finally {
                is_startWithVote_running = false;
            }
            return;
        }
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
        const end = votes[Math.floor(Math.random() * votes.length)];
        const timestamp = Date.now();
        current_round.value = {
            wiki_lang: current_round.value.wiki_lang,
            remaining_after_win_duration: store.gamedata.remaining_after_win_duration,
            winners: {},
            start,
            end
        }
        for (const player of Object.values(store.players)) {
            store.gamedata.player_data[player.id] ??= {};
            store.gamedata.player_data[player.id][store.gamedata.round.current] ??= {
                twitch_votes: {}, score: 0, vote_skip: false, page_vote: null, history: {}
            };
            store.gamedata.player_data[player.id][store.gamedata.round.current].history[timestamp] = {
                id: start.id,
                title: start.title,
            }
        }
        changeGamephase("Playing");
        is_startWithVote_running = false;
    }

    async function startWithTwitchVote() {
        const all_twitch_vote = 
            current_round_connected_player_data.value
                .reduce<Record<string/*username*/,string/*raw vote*/>>((acc,x)=>({...acc,...(x.twitch_votes)}),{});
        const shuffled_twitch_votes = shuffleObjectKeys(all_twitch_vote);
        const abort = new AbortController();
        let start:WikiContentPreview|null = null;
        let end:WikiContentPreview|null = null;
        for await (const page of findWikiPreviewStream(Object.values(shuffled_twitch_votes), current_round.value.wiki_lang, abort)) {
            if (end == null) {
                end = page;
                continue;
            } else if (start == null) {
                if (end.id != page.id) {
                    start = page;
                    continue;
                }
            } else {
                break;
            }
        }
        if (start == null || end == null) {
           const [page1, page2] = await getRandomPage(current_round.value.wiki_lang, 2);
           if (end == null) end = page1;
           start = end.id == page2.id ? page1 : page2;
        } else {
            abort.abort();
        }
        const timestamp = Date.now();
        current_round.value = {
            wiki_lang: current_round.value.wiki_lang,
            remaining_after_win_duration: store.gamedata.remaining_after_win_duration,
            winners: {},
            start,
            end
        }
        for (const player of Object.values(store.players)) {
            store.gamedata.player_data[player.id] ??= {};
            store.gamedata.player_data[player.id][store.gamedata.round.current] ??= {
                twitch_votes: {}, score: 0, vote_skip: false, page_vote: null, history: {}
            };
            store.gamedata.player_data[player.id][store.gamedata.round.current].history[timestamp] = {
                id: start.id,
                title: start.title,
            }
        }
        changeGamephase("Playing");
    }

    function win(player_id:PlayerID) {
        if (current_phase.value.type != "Playing") return;
        const entries = Object.entries(store.gamedata.round_data[store.gamedata.round.current].winners);
        // first winner
        if (entries.length == 0) {
            const t = Date.now();
            const score = 1000;
            store.gamedata.player_data[player_id][store.gamedata.round.current].score = score;
            store.gamedata.round_data[store.gamedata.round.current].winners[player_id] = {
                score,
                timestamp: t
            }
            if (current_round.value.remaining_after_win_duration == 0) return changeGamephase("RoundEnd");
            if (
                [...connectedPlayerIds.values()]
                    .every(id=>store.gamedata.round_data[store.gamedata.round.current].winners[id] != null)
            ) {
                changeGamephase("RoundEnd");
            }
        } else {
            if(store.gamedata.round_data[store.gamedata.round.current].winners[player_id] != null) return;
            const time = Date.now();
            const score_start = 750;
            const score_end   = 500;
            const time_start  = first_win_of_round_timestamp.value;
            const time_end    = time_start + (current_round.value.remaining_after_win_duration*1000);
            const score = (() => {
                if (time <= time_start) return score_start;
                if (time >= time_end) return score_end;
                const progress = (time - time_start) / (time_end - time_start);
                return Math.ceil(score_start - progress * (score_start - score_end));
            })();
            store.gamedata.player_data[player_id][store.gamedata.round.current].score = score;
            store.gamedata.round_data[store.gamedata.round.current].winners[player_id] = {
                score,
                timestamp: time
            }
            if (
                [...connectedPlayerIds.values()]
                    .every(id=>store.gamedata.round_data[store.gamedata.round.current].winners[id] != null)
            ) {
                changeGamephase("RoundEnd");
            }
        }

    }

    const open_podium = ref(false);

    return {
        ...gameStore,
        currentWikiPage,
        currentEndPage,
        rawCountDown,
        countDown,
        rawRemainCountDown,
        remainCountDown,
        remainCountDownSeconds,
        current_round_all_player_data,
        current_round_connected_player_data,
        first_win_of_round_timestamp,
        current_round_player_data,
        open_podium,
        changeGamephase,
        startWithVote,
        start,
        win
    }
}

let is_startWithVote_running = false;

export function useClassicGameLifeCycle() {
    const {
        remainCountDownSeconds,
        isHost,
        current_phase,
        startWithVote,
        open_podium,
        store,
        current_round_connected_player_data,
        changeGamephase,
        win
    } = useClassicGameStore();

    watch(remainCountDownSeconds, (_newValue, _oldValue) => {
        if (!isHost.value) return;
        if (current_phase.value.type == "Voting") {
            if (remainCountDownSeconds.value <= 0) {
                startWithVote();
            }
        } else if (current_phase.value.type == "Playing") {
            if (remainCountDownSeconds.value <= 0) {
                changeGamephase("RoundEnd");
            }
        } else if (current_phase.value.type == "RoundEnd") {
            if (remainCountDownSeconds.value <= 0) {
                if ((store.gamedata.round.current+1) > store.gamedata.round.max) {
                    open_podium.value = true;
                    changeGamephase("Podium");
                    return 
                }
                store.gamedata.round.current++;
                changeGamephase("Waiting");
                const controlScreen = document.querySelector(".control-screen.mode-classic");
                controlScreen?.scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});
                
            }
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
        } else if (phase == "Podium") {
            const controlScreen = document.querySelector(".control-screen.mode-classic");
            controlScreen?.scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});
        }
    });

    watch(current_round_connected_player_data, (players_data, _oldValue) => {
        if (current_phase.value.type !== "Playing" || !isHost.value) return;

        const round = store.gamedata.round.current;
        const endPageTitle = store.gamedata.round_data[round].end.title;

        for (const player of players_data) {
            const history = player.history;
            if (!history) continue;

            const timestamps = Object.keys(history).map(Number);
            if (timestamps.length === 0) continue;

            const latestTimestamp = Math.max(...timestamps);
            const latestPage = history[latestTimestamp];

            if (latestPage && latestPage.title === endPageTitle) {
                win(player.player_id as PlayerID);
                return;
            }
        }
    }, { deep: true });

    watch(current_round_connected_player_data, (players_data, _oldValue) => {
        if (current_phase.value.type !== "Playing" || !isHost.value) return;
        if (players_data.every(p=>p.vote_skip)) {
            changeGamephase("RoundEnd");
        }

    }, { deep: true });

}

async function useClassicTwich() {
    if (twitch_oauth_token.value == null) return;

    const {
        current_phase,
        current_round_player_data
    } = useClassicGameStore();

    const authProvider = new StaticAuthProvider(twitch_client_id, twitch_oauth_token.value, twitch_oauth_scope.value!);
    const apiClient = new ApiClient({ authProvider });
    const token_info = await apiClient.getTokenInfo();
    const user_channel = token_info.userName!;
    const chatClient = new ChatClient({
        authProvider,
        channels: [user_channel] // Replace with the desired channel
    });

    await chatClient.connect();

    chatClient.onMessage((channel, user, message) => {
        if (current_phase.value.type != "Voting") return;
        if (!message.startsWith("!vote ")) return;
        current_round_player_data.value.twitch_votes[user] = message.slice(6);
        
    });

}