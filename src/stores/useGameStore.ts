import { computed, reactive } from "vue";
import { password, player_id, room_name, username } from "./form";
import type { Game, Timestamp } from "./game";
import { useSyncedStore } from "./syncedStore";
import { classic_initial_gamedata } from "./mode/classic/initialGamedata";

let gameStore:ReturnType<typeof useInnerGameStore> | null = null;

export function useGameStore() {
    if (gameStore != null) return gameStore;
    gameStore = useInnerGameStore();
    return gameStore;
}


function useInnerGameStore() {
    const timestamp = Date.now();

    const initialGameState:Game = {
        version: "0.1.0",
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
    };

    const { store, ydoc, webRtcProvider, disconnect } = useSyncedStore(initialGameState, room_name.value, password.value);

    const connectedPlayerIds = reactive(new Set<string>([player_id.value]));

    const isHost = computed(() => store.host_id == player_id.value);

    function latestTimestamp(record:Record<Timestamp, unknown>):number {
        return Object.keys(record).reduce<number>((acc,t) => {
            const n = Number(t);
            return n >= acc ? n : acc;
        }, -1)
    }

    const my_player_data = computed({
        get() {
            return store.gamedata.player_data[player_id.value];
        },
        set(newValue) {
            store.gamedata.player_data[player_id.value] = newValue;
        }
    });

    const my_player_round_data = computed({
        get() {
            store.gamedata.player_data[player_id.value] ??= {};
            store.gamedata.player_data[player_id.value][store.gamedata.round.current] ??= {
                history: {},
                page_vote: null,
                score: 0
            }
            return store.gamedata.player_data[player_id.value][store.gamedata.round.current];
        },
        set(newValue) {
            const initial = {
                history: {},
                page_vote: null,
                score: 0
            };
            store.gamedata.player_data[player_id.value] ??= { [store.gamedata.round.current]: initial };
            store.gamedata.player_data[player_id.value][store.gamedata.round.current] = newValue;
        }
    });

    const current_phase_start = computed(() => latestTimestamp(store.gamedata.gamephase));
    
    const current_phase = computed({
        get() {
            if (current_phase_start.value == -1) return {} as never;
            return store.gamedata.gamephase[current_phase_start.value];
        },
        set(newValue) {
            if (current_phase_start.value == -1) return;
            store.gamedata.gamephase[current_phase_start.value] = newValue;
        }
    });

    const current_round = computed({
        get() {
            return store.gamedata.round_data[store.gamedata.round.current];
        },
        set(newValue) {
            store.gamedata.round_data[store.gamedata.round.current] = newValue;
        }
    });


    webRtcProvider.awareness.on("update", async () => {
        connectedPlayerIds.clear();
        webRtcProvider.awareness.getStates().forEach((player) => {
            if (
                !("player_id" in player) ||
                player.player_id == null || 
                !(typeof player.player_id === 'string')
            ) return;
            connectedPlayerIds.add(player.player_id);
            if (isHost.value) {
                if (!("username" in player)) return;
                const joinedAt = store.players[player.player_id]?.joinedAt ?? Date.now();
                store.players[player.player_id] = {
                    id: player.player_id,
                    name: player.username,
                    avatar: "",
                    joinedAt
                };
            }
        });
        if (!connectedPlayerIds.has(store.host_id)) {
            const url = new URL(webRtcProvider.signalingUrls[0]);
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
    });

    return {
        store,
        connectedPlayerIds,
        isHost,
        ydoc,
        webRtcProvider,
        disconnect,
        my_player_data,
        my_player_round_data,
        current_phase,
        current_phase_start,
        current_round,
        latestTimestamp
    }
}