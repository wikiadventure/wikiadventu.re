import { computed, ref, watch } from "vue";
import { useGameStore } from "../../useGameStore";
import { useTimestamp } from "@vueuse/core";
import type { EpicGamephase, PlayerID, RoundNumber, Timestamp, VoteWikiPage, WikiPageId } from "../../game";
import { findWikiPreviewStream, getRandomPage, type WikiContentPreview } from "../../../composables/useWiki";
import { twitch_client_id, twitch_oauth_scope, twitch_oauth_token } from "../../../composables/useTwitch";
import { ChatClient } from "@twurple/chat";
import { StaticAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";
import { shuffleObjectKeys } from "../../../composables/numberUtils";

let epicGameStore:ReturnType<typeof useEpicInnerGameStore> | null = null;

export function useEpicGameStore() {
    if (epicGameStore != null) return epicGameStore;
    epicGameStore = useEpicInnerGameStore();
    return epicGameStore;
}


function useEpicInnerGameStore() {
    const gameStore = useGameStore<"Epic">();

    const { 
        latestTimestamp, my_player_round_data, current_round, current_phase_start, current_phase,
        store, connectedPlayerIds, player_id, getSyncedTimestamp, durationInputToSeconds
    } = gameStore;

    const currentWikiPage = computed(() => {
        const t = latestTimestamp(my_player_round_data.value.history);
        return my_player_round_data.value.history[t];
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
            player_id: id as PlayerID,
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
        return Object.entries(current_round.value?.winners ?? {})
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

    const current_pages_pool = computed(() => {
        return current_round.value.pages_pool;
    })
    

    function changeGamephase(next_phase:EpicGamephase, timestamp?:Timestamp, round?:RoundNumber, duration?:number) {
        timestamp ??= getSyncedTimestamp();
        store.gamedata.gamephase[timestamp] = {
            duration: duration ?? durationInputToSeconds(store.gamedata.phase_duration[next_phase]),
            round: round ?? store.gamedata.round.current,
            type: next_phase
        }
    }

    async function start() {
        const timestamp = getSyncedTimestamp();
        if (store.gamedata.wiki_page_pick_mode == "vote") {
            // TODO clean this
            // @ts-ignore
            current_round.value = {
                wiki_lang: store.gamedata.wiki_lang,
            }
            changeGamephase("Voting", timestamp);
            return;
        }
        const pages_found_to_win = store.gamedata.pages_found_to_win;
        const pages_pool_size = store.gamedata.pages_pool_size;
        const pages_pool_order_mandatory = store.gamedata.pages_pool_order_mandatory;
        const random_pages_pool = await getRandomPage(store.gamedata.wiki_lang, {
            grnlimit: pages_pool_size,
            grnminsize: store.gamedata.wiki_random.grnminsize,
            grnmaxsize: store.gamedata.wiki_random.grnmaxsize,
        });
        current_round.value = {
            wiki_lang: store.gamedata.wiki_lang,
            remaining_after_win_duration: durationInputToSeconds(store.gamedata.remaining_after_win_duration),
            winners: {},
            pages_found_to_win,
            pages_pool_size,
            pages_pool_order_mandatory,
            pages_pool: random_pages_pool,
        }
        for (const player of Object.values(store.players)) {
            store.gamedata.player_data[player.id] ??= {};
            store.gamedata.player_data[player.id][store.gamedata.round.current] ??= {
                twitch_votes: {}, score: 0, vote_skip: false, page_vote: null, history: {}
            };
            store.gamedata.player_data[player.id][store.gamedata.round.current].history[timestamp] = {
                id: random_pages_pool[0].id,
                title: random_pages_pool[0].title,
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
        const pages_found_to_win = store.gamedata.pages_found_to_win;
        const pages_pool_size = store.gamedata.pages_pool_size;
        const pages_pool_order_mandatory = store.gamedata.pages_pool_order_mandatory;
        const round_wiki_lang = store.gamedata.wiki_lang;
        let votes = Object.values(store.gamedata.player_data)
            .reduce<VoteWikiPage[]>((acc,p) => {
                const player_round_data = p[store.gamedata.round.current];
                if(player_round_data.page_vote == null) return acc;
                if(player_round_data.page_vote.wiki_lang != round_wiki_lang) return acc;
                acc.push(player_round_data.page_vote);
                return acc;
            }, []);
        const distinctVoteLength = new Set(votes.map(vote => vote.id)).size;
        if (distinctVoteLength < pages_pool_size) {
            try {
                const pages = await getRandomPage(round_wiki_lang, {
                    grnlimit: pages_pool_size - distinctVoteLength,
                    grnminsize: store.gamedata.wiki_random.grnminsize,
                    grnmaxsize: store.gamedata.wiki_random.grnmaxsize,
                });
                votes.push(...pages);
            } catch(e) {
                setTimeout(()=>is_startWithVote_running = false, 5000);
                is_startWithVote_running = false;
                return;
            }
        }

        // TODO check collision between random pages and vote
        const pickedPages = new Map<number,WikiContentPreview>();
        let refillTries = 0;
        while (pickedPages.size < pages_pool_size) {
            if (votes.length == 0) {
                try {
                    refillTries++;
                    if (refillTries > 3) throw "Can't fill pages pool with random page";
                    const pages = await getRandomPage(round_wiki_lang, {
                        grnlimit: pages_pool_size,
                        grnminsize: store.gamedata.wiki_random.grnminsize,
                        grnmaxsize: store.gamedata.wiki_random.grnmaxsize,
                    });
                    for (const page of pages) {
                        if (!pickedPages.has(page.id)) votes.push(...pages);
                    }
                    if (votes.length == 0) continue;
                } catch(e) {
                    setTimeout(()=>is_startWithVote_running = false, 5000);
                    is_startWithVote_running = false;
                    return;
                }
            }
            const page = votes[Math.floor(Math.random() * votes.length)];
            pickedPages.set(page.id, page);
            votes = votes.filter(v=>page.id!=v.id);
        }
        const timestamp = getSyncedTimestamp();
        const pages_pool = [...pickedPages.values()];
        current_round.value = {
            wiki_lang: current_round.value.wiki_lang,
            remaining_after_win_duration: durationInputToSeconds(store.gamedata.remaining_after_win_duration),
            winners: {},
            pages_pool: pages_pool,
            pages_found_to_win,
            pages_pool_order_mandatory,
            pages_pool_size
        }
        for (const player of Object.values(store.players)) {
            store.gamedata.player_data[player.id] ??= {};
            store.gamedata.player_data[player.id][store.gamedata.round.current] ??= {
                twitch_votes: {}, score: 0, vote_skip: false, page_vote: null, history: {}
            };
            store.gamedata.player_data[player.id][store.gamedata.round.current].history[timestamp] = {
                id: pages_pool[0].id,
                title: pages_pool[0].title,
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
        const pickedPages = new Map<number,WikiContentPreview>();
        const pages_found_to_win = store.gamedata.pages_found_to_win;
        const pages_pool_size = store.gamedata.pages_pool_size;
        const pages_pool_order_mandatory = store.gamedata.pages_pool_order_mandatory;
        const round_wiki_lang = store.gamedata.wiki_lang;
        for await (const page of findWikiPreviewStream(Object.values(shuffled_twitch_votes), current_round.value.wiki_lang, abort)) {
            pickedPages.set(page.id, page);
            if (pickedPages.size >= pages_pool_size) break;
        }
        let refillTries = 0;
        fill_with_random_pages: while (pickedPages.size < pages_pool_size) {
            if (pickedPages.size >= pages_pool_size) break;
            try {
                refillTries++;
                if (refillTries > 3) throw "Can't fill pages pool with random page";
                const pages = await getRandomPage(round_wiki_lang, {
                    grnlimit: pages_pool_size,
                    grnminsize: store.gamedata.wiki_random.grnminsize,
                    grnmaxsize: store.gamedata.wiki_random.grnmaxsize,
                });
                for (const page of pages) {
                    pickedPages.set(page.id, page);
                    if (pickedPages.size >= pages_pool_size) break fill_with_random_pages;
                }
            } catch(e) {
                setTimeout(()=>is_startWithVote_running = false, 5000);
                is_startWithVote_running = false;
                return;
            }
        }
        const pages_pool = [...pickedPages.values()];
        const timestamp = getSyncedTimestamp();
        current_round.value = {
            wiki_lang: current_round.value.wiki_lang,
            remaining_after_win_duration: durationInputToSeconds(store.gamedata.remaining_after_win_duration),
            winners: {},
            pages_found_to_win,
            pages_pool_order_mandatory,
            pages_pool_size,
            pages_pool
        }
        for (const player of Object.values(store.players)) {
            store.gamedata.player_data[player.id] ??= {};
            store.gamedata.player_data[player.id][store.gamedata.round.current] ??= {
                twitch_votes: {}, score: 0, vote_skip: false, page_vote: null, history: {}
            };
            store.gamedata.player_data[player.id][store.gamedata.round.current].history[timestamp] = {
                id: pages_pool[0].id,
                title: pages_pool[0].title,
            }
        }
        changeGamephase("Playing");
    }

    function win(player_id:PlayerID) {
        if (current_phase.value.type != "Playing") return;
        const entries = Object.entries(current_round.value.winners);
        // first winner
        if (entries.length == 0) {
            const t = getSyncedTimestamp();
            const score = 1000;
            store.gamedata.player_data[player_id][store.gamedata.round.current].score = score;
            current_round.value.winners[player_id] = {
                score,
                timestamp: t
            }
            if (current_round.value.remaining_after_win_duration == 0) return changeGamephase("RoundEnd");
            if (
                [...connectedPlayerIds.values()]
                    .every(id=>current_round.value.winners[id] != null)
            ) {
                changeGamephase("RoundEnd");
            }
        } else {
            if(current_round.value.winners[player_id] != null) return;
            const time = getSyncedTimestamp();
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
            current_round.value.winners[player_id] = {
                score,
                timestamp: time
            }
            if (
                [...connectedPlayerIds.values()]
                    .every(id=>current_round.value.winners[id] != null)
            ) {
                changeGamephase("RoundEnd");
            }
        }

    }


    const current_pages_pool_id_map = computed(() => {
        const map = new Map<number,WikiContentPreview>();
        for (const page of current_pages_pool.value) {
            map.set(page.id, page);
        }
        return map;
    });

    const current_round_players_progress = computed(() => {
        if (current_round.value == null) return {};
        
        const pages_pool_order_mandatory = current_round.value.pages_pool_order_mandatory;
        const players_progress = {} as Record<PlayerID, WikiPageId[]>;
        if (pages_pool_order_mandatory) {
            for (const player of current_round_connected_player_data.value) {
                const history = player.history;
                if (!history) continue;

                const timestamps = Object.keys(history).map(Number) as Timestamp[];
                if (timestamps.length === 0) continue;
                const pages_found:WikiPageId[] = [];
                const pages_pool = current_pages_pool.value;
                const history_sorted = Object.entries(history).map(([t,p])=>[Number(t),p] as const).sort(([a], [b]) => a - b);
                for (const [_t,page] of history_sorted) {
                    if (page.id == pages_pool[pages_found.length]?.id) {
                        pages_found.push(page.id);
                    }
                }
                players_progress[player.player_id] = pages_found;
            }
        } else {

            for (const player of current_round_connected_player_data.value) {
                const history = player.history;
                if (!history) continue;

                const timestamps = Object.keys(history).map(Number) as Timestamp[];
                if (timestamps.length === 0) continue;
                const pages_found = new Set<WikiPageId>();
                for (const page of Object.values(history)) {
                    if (current_pages_pool_id_map.value.has(page.id)) {
                        pages_found.add(page.id);
                    }
                }
                players_progress[player.player_id] = [...pages_found];
            }
            
        }
        return players_progress;
    });

    const my_current_round_player_progress = computed(() => current_round_players_progress.value[player_id.value] ?? []);
    const my_current_round_player_progress_set = computed(() => new Set(my_current_round_player_progress.value));

    const open_podium = ref(false);

    return {
        ...gameStore,
        currentWikiPage,
        rawCountDown,
        countDown,
        rawRemainCountDown,
        remainCountDown,
        remainCountDownSeconds,
        current_pages_pool,
        
        current_round_all_player_data,
        current_round_connected_player_data,
        first_win_of_round_timestamp,
        current_round_player_data,
        open_podium,
        current_round_players_progress,
        current_pages_pool_id_map,
        my_current_round_player_progress_set,

        changeGamephase,
        startWithVote,
        start,
        win
    }
}

let is_startWithVote_running = false;

export async function useEpicGameLifeCycle() {
    const {
        remainCountDownSeconds,
        isHost,
        current_phase,
        startWithVote,
        open_podium,
        store,
        current_round,
        current_round_players_progress,
        current_round_connected_player_data,
        changeGamephase,
        win
    } = await useEpicGameStore();

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
                const controlScreen = document.querySelector(".control-screen.mode-epic");
                controlScreen?.scrollIntoView({behavior: 'instant', block: 'start', inline: 'center'});
                
            }
        }
    });

    watch(() => current_phase.value.type, (phase, _oldValue) => {
        if (phase == "Voting") {
            const controlScreen = document.querySelector(".control-screen.mode-classic");
            controlScreen?.scrollIntoView({behavior: 'instant', block: 'start', inline: 'center'});
        } else if (phase == "Playing") {
            const playArea = document.getElementById("play-area");
            playArea?.scrollIntoView({behavior: 'instant', block: 'start', inline: 'center'});
        } else if (phase == "Waiting") {
            const controlScreen = document.querySelector(".control-screen.mode-classic");
            controlScreen?.scrollIntoView({behavior: 'instant', block: 'start', inline: 'center'});
        } else if (phase == "Podium") {
            const controlScreen = document.querySelector(".control-screen.mode-classic");
            controlScreen?.scrollIntoView({behavior: 'instant', block: 'start', inline: 'center'});
        }
    });

    watch(current_round_players_progress, (players_progress, _oldValue) => {
        if (current_phase.value.type !== "Playing" || !isHost.value) return;
        const pages_found_to_win = current_round.value.pages_found_to_win;
        for (const [player_id, progress] of Object.entries(players_progress)) {
            if (progress.length >= pages_found_to_win) win(player_id as PlayerID);
        }

    }, { deep: true });

    watch(current_round_connected_player_data, (players_data, _oldValue) => {
        if (current_phase.value.type !== "Playing" || !isHost.value) return;
        if (players_data.every(p=>p.vote_skip)) {
            changeGamephase("RoundEnd");
        }

    }, { deep: true });

}

export async function useEpicTwich() {
    if (twitch_oauth_token.value == null) return;

    const {
        current_phase,
        current_round_player_data
    } = await useEpicGameStore();

    const authProvider = new StaticAuthProvider(twitch_client_id, twitch_oauth_token.value, twitch_oauth_scope.value!);
    const apiClient = new ApiClient({ authProvider });
    const token_info = await apiClient.getTokenInfo();
    const user_channel = token_info.userName!;
    const chatClient = new ChatClient({
        authProvider,
        channels: [user_channel] // Replace with the desired channel
    });

    await chatClient.connect();

    chatClient.onMessage((_channel, user, message) => {
        if (current_phase.value.type != "Voting") return;
        if (!message.startsWith("!vote ")) return;
        current_round_player_data.value.twitch_votes[user] = message.slice(6);
        
    });

}