import { computed, reactive, ref, type Reactive, type Ref } from "vue";
import { password, player_id as form_player_id, room_name as form_room_name, username as form_username } from "./form";
import { VERSION, type DurationInput, type Game, type Gamemode, type PlayerID, type RoundNumber, type Timestamp } from "./game";
import { getSyncedTimestamp, useSyncedStore } from "./syncedStore";
import { classic_initial_gamedata } from "./mode/classic/initialGamedata";

let gameStore:ReturnType<typeof useInnerGameStore> | null = null;

export function useGameStore<Mode extends Gamemode>() {
    if (gameStore != null) return gameStore as ReturnType<typeof useInnerGameStore<Mode>>;
    gameStore = useInnerGameStore<Mode>();
    return gameStore as ReturnType<typeof useInnerGameStore<Mode>>;
}

export function resetGameStore() {
    gameStore = null;
}

function useInnerGameStore<Mode extends Gamemode>() {

    const player_id = ref(form_player_id.value as PlayerID);
    const room_name = ref(form_room_name.value);
    const username  = ref(form_username.value);

    const timestamp = getSyncedTimestamp();

    const initialGameState = {
        version: VERSION,
        players: {
            [player_id.value]: {
                avatar: "",
                id: player_id.value,
                name: username.value,
                joinedAt: timestamp,
            }
        },
        gamemode: "Classic",
        gamedata: classic_initial_gamedata(timestamp),
        host_id: player_id.value,
    } as Game<Mode>;

    const { store, ydoc, webRtcProvider, disconnect, wipeYjsDoc } = useSyncedStore<Game<Mode>>(initialGameState, room_name.value, password.value);

    webRtcProvider.awareness.setLocalState({
        player_id: player_id.value,
        username: username.value
    });

    const connectedPlayerIds = reactive(new Set<PlayerID>([player_id.value]));

    const {
        latestTimestamp,
        isHost,
        my_player_data,
        my_player_round_data,
        current_phase,
        current_phase_start,
        current_round,
    } = createComputedShortcut<Mode>({ store, player_id });

    handleHostRotationAndNewPlayer({ webRtcProvider, connectedPlayerIds, store, isHost, player_id });

    function durationInputToSeconds(durationInput?:DurationInput) {
        if (durationInput == null) return -1;
        return  durationInput.unit == "hours"   ? durationInput.value * 3600 :
                durationInput.unit == "minutes" ? durationInput.value * 60 :
                durationInput.unit == "seconds" ? durationInput.value :
                                                  durationInput.value;
    }

    return {
        store,
        connectedPlayerIds,
        isHost,
        ydoc,
        webRtcProvider,
        disconnect,
        wipeYjsDoc,
        my_player_data,
        my_player_round_data,
        current_phase,
        current_phase_start,
        current_round,
        latestTimestamp,
        player_id,
        room_name,
        username,
        getSyncedTimestamp,
        durationInputToSeconds
    }
}

type CreateComputedShortcutCtx<Mode extends Gamemode> = {
    store: Reactive<Game<Mode>>,
    player_id: Ref<PlayerID>
}

function createComputedShortcut<Mode extends Gamemode>(ctx:CreateComputedShortcutCtx<Mode>) {
    const { store, player_id } = ctx as CreateComputedShortcutCtx<Mode>;

    function latestTimestamp(record:Record<Timestamp, unknown>):Timestamp {
        return Object.keys(record).reduce<Timestamp>((acc,t) => {
            const n = Number(t) as Timestamp;
            return n >= acc ? n : acc;
        }, -1 as Timestamp);
    }

    const isHost = computed(() => store.host_id == player_id.value);

    const my_player_data = computed({
        get() {
            if (store.gamedata == null) return {} as never;
            return store.gamedata.player_data[player_id.value] as Game<Mode>["gamedata"]["player_data"][PlayerID];
        },
        set(newValue: Game<Mode>["gamedata"]["player_data"][PlayerID]) {
            store.gamedata.player_data[player_id.value] = newValue;
        }
    });

    const my_player_round_data = computed({
        get() {
            if (store.gamedata == null) return {} as never;
            store.gamedata.player_data[player_id.value] ??= {};
            store.gamedata.player_data[player_id.value][store.gamedata.round.current] ??= {
                twitch_votes: {},
                history: {},
                page_vote: null,
                vote_skip: false,
                score: 0
            }
            return store.gamedata.player_data[player_id.value][store.gamedata.round.current] as Game<Mode>["gamedata"]["player_data"][PlayerID][RoundNumber];
        },
        set(newValue: Game<Mode>["gamedata"]["player_data"][PlayerID][RoundNumber]) {
            const initial = {
                twitch_votes: {},
                history: {},
                page_vote: null,
                vote_skip: false,
                score: 0
            };
            store.gamedata.player_data[player_id.value] ??= { [store.gamedata.round.current]: initial };
            store.gamedata.player_data[player_id.value][store.gamedata.round.current] = newValue;
        }
    });

    const current_phase_start = computed(() => latestTimestamp(store.gamedata?.gamephase ?? {}));
    
    const current_phase = computed({
        get() {
            if (current_phase_start.value == -1) return {} as never;
            if (store.gamedata == null) return {} as never;
            return store.gamedata.gamephase[current_phase_start.value] as Game<Mode>["gamedata"]["gamephase"][Timestamp];
        },
        set(newValue: Game<Mode>["gamedata"]["gamephase"][Timestamp]) {
            if (current_phase_start.value == -1) return;
            store.gamedata.gamephase[current_phase_start.value] = newValue;
        }
    });

    const current_round = computed({
        get() {
            if (store.gamedata == null) return {} as never;
            return store.gamedata.round_data[store.gamedata.round.current] as Game<Mode>["gamedata"]["round_data"][RoundNumber];
        },
        set(newValue: Game<Mode>["gamedata"]["round_data"][RoundNumber]) {
            store.gamedata.round_data[store.gamedata.round.current] = newValue;
        }
    });

    return {
        latestTimestamp,
        isHost,
        my_player_data,
        my_player_round_data,
        current_phase_start,
        current_phase,
        current_round
    }

}

type HandleHostRotationAndNewPlayerCtx = 
    Pick<
        Awaited<ReturnType<typeof useInnerGameStore>>, 
        "webRtcProvider"|"connectedPlayerIds"|"store"|"isHost"|"player_id"
    >;

function handleHostRotationAndNewPlayer(ctx:HandleHostRotationAndNewPlayerCtx) {
    const { webRtcProvider, connectedPlayerIds, store, isHost, player_id } = ctx;
    async function onAwarnessUpdate() {
        connectedPlayerIds.clear();
        // We update connected player list
        webRtcProvider.awareness.getStates().forEach((player:unknown) => {
            if (
                !(typeof player === "object" && player !== null && "player_id" in player) ||
                player.player_id == null || 
                !(typeof player.player_id === 'string')
            ) return;
            connectedPlayerIds.add(player.player_id as PlayerID);
            // Only the host add player to store to avoid duplicate
            if (isHost.value) {
                if (!(typeof player === "object" && player !== null && "username" in player && typeof player.username === "string")) return;
                const joinedAt = store.players[player.player_id as PlayerID]?.joinedAt ?? getSyncedTimestamp();
                store.players[player.player_id as PlayerID] = {
                    id: player.player_id as PlayerID,
                    name: player.username,
                    avatar: "",
                    joinedAt
                };
            }
        });
        // Change host if host if not connected
        if (!connectedPlayerIds.has(store.host_id)) {
            const url = new URL(import.meta.env.VITE_SIGNALING_SERVER!);
            url.pathname = "/ping";
            const isConnected = await fetch(url, {
                method: "HEAD"
            }).then(_=>true).catch(_=>false);
            if (isConnected) {
                const oldestConnectedPlayerId = [...connectedPlayerIds].reduce((oldest, p) => {
                    return store.players[oldest].joinedAt < store.players[oldest].joinedAt ? p : oldest;
                },  player_id.value);
                store.host_id = oldestConnectedPlayerId;
            }
        }
    }
    webRtcProvider.awareness.on("update", onAwarnessUpdate);
    return {
        unregister: () => webRtcProvider.awareness.off("update", onAwarnessUpdate)
    };
}
