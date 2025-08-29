import { reactive, watch, type Reactive } from "vue";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { VERSION, type PlayerID, type Timestamp } from "./game";

const signaling_server = import.meta.env.VITE_SIGNALING_SERVER!;

function toYType(v: any): any {
    if (v === null) return v;
    if (typeof v !== 'object') return v;
    if (Array.isArray(v)) {
        return Y.Array.from(v.map(toYType));
    }
    const map = new Y.Map();
    for (const key in v) {
        map.set(key, toYType(v[key]));
    }
    return map;
}

export type FormPlayer = {
    id: PlayerID,
    name: string,
}
/**
 * 
 * @param initialState the initial state of the synced store
 * @param onJoin a function to resolve the state when a new player join. 
 *  You have access to "store" alias your local state and 
 *  snapshot that should correspond to the initial state of a new peers
 * @param room_name The name of the web rtc room to join
 * @param password an optionnal password used to access the room
 * @returns 
 */
export function useSyncedStore<T extends object>(initialState:T, room_name:string, password:string) {
    // We initiate the reactive store with empty to set watchers before setting the initial state
    const store = reactive({}) as Reactive<T & { creation_timestamp: number }>;

    // We create a all yjs related stuff for it to work with web rtc
    const ydoc  = new Y.Doc({
        autoLoad: true
    });
    // used to force encryption
    if (password == "") password = room_name;

    const searchParams = new URLSearchParams({
        password
    })

    const webRtcProvider = new WebrtcProvider(room_name, ydoc, {
        signaling: [signaling_server+"/"+VERSION+"/"+room_name+"?"+searchParams.toString()],
        password,

    });

    const ymap = ydoc.getMap('store');

    let forWipeToComplete = Promise.resolve();
    let wipeToCompleteResolver = () => {};
    // use to completely wipe the ydoc to restart game ro change gamemode
    function wipeYjsDoc() {
        forWipeToComplete = new Promise((res, _rej)=> wipeToCompleteResolver = res);
        ydoc.transact(() => {

        }, { wipe: true });
        return forWipeToComplete;
    }
    

    /**
     * Recursively syncs a plain JavaScript object to a Y.Map.
     * @param source The source object with new values.
     * @param target The Y.Map to sync to.
     */
    function syncToYjs(source: Record<string, any>, target: Y.Map<any>) {
        // Set or update keys from the source
        for (const key in source) {
            if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

            const sourceValue = source[key];
            const targetValue = target.get(key);

            if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
                // It's a nested object. Ensure the target has a Y.Map.
                let yMap = targetValue;
                if (!(yMap instanceof Y.Map)) {
                    yMap = new Y.Map();
                    target.set(key, yMap);
                }
                syncToYjs(sourceValue, yMap);
            } else if (Array.isArray(sourceValue)) {
                // It's an array. Ensure the target has a Y.Array.
                let yArray = targetValue;
                if (!(yArray instanceof Y.Array)) {
                    yArray = new Y.Array();
                    target.set(key, yArray);
                }
                // A simple but effective way to sync arrays: replace the content.
                // For performance on large, frequently-updated arrays, a more granular diffing would be better.
                yArray.delete(0, yArray.length);
                yArray.push(sourceValue.map(toYType));
            } else {
                // It's a primitive. Set it only if it has changed.
                if (targetValue !== sourceValue) {
                    target.set(key, sourceValue);
                }
            }
        }

        // Remove keys that exist in the target but not in the source
        // for (const key of target.keys()) {
        //     if (!(key in source)) {
        //         target.delete(key);
        //     }
        // }
    }

    // When the store change when create a new ydoc transaction
    // To send new state with other peer.
    const stopWatching = watch(store, (newValue, _oldValue) => {
        ydoc.transact(() => {
            syncToYjs(newValue, ymap);
        }, {
            creation_timestamp: store.creation_timestamp
        });
    }, { deep: true });

    // When the ydoc receive a update from peers
    // We sync the ydoc state with the reactive store
    ydoc.on('beforeTransaction', (tr: Y.Transaction) => {

        if ((tr.origin as any)?.wipe) {
            for (const key of Object.keys(store)) {
                delete store[key as keyof typeof store];
            }
            ydoc.transact(()=> {
                for (const key of ymap.keys()) {
                    ymap.delete(key);
                }
            }, { local_wipe: true });
            wipeToCompleteResolver();
            return;
        }
        if (tr.local) {
            return;
        }
        if ((tr.origin as any)?.local_wipe) {
            tr.deleteSet.clients.clear();
            tr.changed.clear();
            tr.changedParentTypes.clear();
            return 
        }

        const remote_creation_timestamp = (tr.origin as any)?.creation_timestamp;
        if (remote_creation_timestamp && remote_creation_timestamp > store.creation_timestamp) {
            // This is a transaction from a new peer with its initial state.
            // We don't want to apply it because our state is more up-to-date.
            // By not applying the transaction, we prevent our ydoc from being overwritten.
            // We can achieve this by manipulating the transaction's internal properties.
            tr.deleteSet.clients.clear();
            tr.changed.clear();
            tr.changedParentTypes.clear();
            return;
        }
    });

    ymap.observeDeep((_events, tr) => {
        // Do not apply changes that originated from this client
        if (tr.local) {
            return;
        }

        const snapshot = ymap.toJSON() as T & { creation_timestamp: number };
        // if the snapshot (the update we receive from peers)
        // have a creation_timestamp after the one we have locally,
        // it means it's a new peers sending it's initial state.
        // we don't want to replace your up to date state with the initial state
        // of a new peers
        // It should be resolve with the onJoin function
        if ((tr.origin as any)?.creation_timestamp > store.creation_timestamp) {
            return;
        }
        for (const key in snapshot) {
            (store as any)[key] = snapshot[key as keyof typeof snapshot];
        }
        // for (const key in store) {
        //     if (!(key in snapshot)) {
        //         delete (store as any)[key];
        //     }
        // }
    });

    // We set the initial state
    for (const [k,v] of Object.entries({...initialState, creation_timestamp: getSyncedTimestamp()})) {
        (store as any)[k] = v;
    }

    const disconnect = () => {
        stopWatching();
        webRtcProvider.disconnect();
        ydoc.destroy();
    };

    return {
        store,
        webRtcProvider,
        ydoc,
        wipeYjsDoc,
        disconnect,
    };
}

const syncedTimestamp = {
    remote: -1,
    local: -1
};

export async function initSyncedTimestamp() {
    if (syncedTimestamp.remote != -1) return;
    const localTimestamp   = performance.now();
    const remoteTimestamp  = await fetch(import.meta.env.VITE_SIGNALING_SERVER!+"/ping", { method: "HEAD" })
                        .then(r=>r.text().then(s=>Number(s)));
    const receiveTimestamp = performance.now();
    // we remove the packet travel time
    const correctedRemoteTimestamp = remoteTimestamp - ((receiveTimestamp - localTimestamp) / 2);
    // the offset
    syncedTimestamp.local = localTimestamp;
    syncedTimestamp.remote = correctedRemoteTimestamp;
}

export function getSyncedTimestamp():Timestamp {
    return syncedTimestamp.remote + (performance.now() - syncedTimestamp.local) as Timestamp;
}
