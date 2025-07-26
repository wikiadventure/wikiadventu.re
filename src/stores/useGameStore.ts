import { computed, nextTick, reactive, type Reactive } from "vue";
import { password, player_id, room_name, username } from "./form";
import type { Game } from "./game";
import { useSyncedStore } from "./syncedStore";

let gameStore:ReturnType<typeof useInnerGameStore> | null = null;

export function useGameStore() {
    if (gameStore != null) return gameStore;
    gameStore = useInnerGameStore();
    return gameStore;
}


function useInnerGameStore() {
    const initialGameState:Game = {
        version: "0.1.0",
        players: {
            [player_id.value]: {
                avatar: "",
                id: player_id.value,
                name: username.value
            }
        },
        gamemode: "Classic",
        gamedata: {
            round: {
                current: 0,
                max: 3,
            },
            gamephase_duration: 300,
            gamephase_start: 0,
            round_data: {

            },
            player_data: {

            },
            syncWikiPage: "France"
        },
        gamephase: "Waiting",
        host_id: player_id.value,
    };

    function onJoin(store:Reactive<Game>, snapshot:Game) {
        console.log("JOIN", {store}, {snapshot});
        for (const [k,player] of Object.entries(snapshot.players)) {
            store.players[k] = player;
        }
    }

    const { store, ydoc, webRtcProvider, disconnect } = useSyncedStore(initialGameState, onJoin, room_name.value, password.value);

    const connectedPlayerIds = reactive(new Set<string>([player_id.value]));

    webRtcProvider.awareness.on("update", () => {
        connectedPlayerIds.clear();
        webRtcProvider.awareness.getStates().forEach((player,k) => {
            if (
                !("player_id" in player) ||
                player.player_id == null || 
                !(typeof player.player_id === 'string')
            ) return;
            connectedPlayerIds.add(player.player_id);
        })
    });

    const isHost = computed(() => store.host_id == player_id.value);

    return {
        store,
        connectedPlayerIds,
        isHost,
        ydoc,
        webRtcProvider,
        disconnect
    }
}