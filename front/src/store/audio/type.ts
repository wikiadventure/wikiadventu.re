import { mute, volume } from "store/setting/state";
import { watch } from "vue";
import { supportedType } from "./support";

/**
 * an audio player that use the volume and mute of the setting store
 */
export class StoreAudio extends Audio { 
    constructor(src:string) {
        const type = supportedType();
        const source = type != "" ? src+"."+type : undefined;
        super(source);
        if (type != "") {
            watch(mute,m=>this.muted=m);
            watch(volume,v=>this.volume=v);
        }
    }
}