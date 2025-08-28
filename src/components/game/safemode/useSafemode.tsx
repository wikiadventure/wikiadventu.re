import { computed, ref, watch } from "vue";
import { safemode } from "../../../composables/useLocalSetting";
import safemodeCSS from "./safemode.css?inline";
import { cssStringToStyleSheet } from "../../../composables/CssStringToStyleSheet";

const SharpEdgeBlurFilter = (
    <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <filter id="sharp-edge-blur-filter" x="0" y="0" width="100%" height="100%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0" edgeMode="none" />
        </filter>
    </svg>
);

const safemodeStyleSheet = cssStringToStyleSheet(safemodeCSS);

export function useSafemode() {
    const safemodeInterrupted = ref(false);
    const safemodeActive = computed(() => safemode.value && !safemodeInterrupted.value);
    /* Use to smooth unblur with svg filter to sharpen the edge of the blur*/
    const safemodeActiveState = ref(safemodeActive.value ? "on" : "off");
    watch(safemodeActive, async (newValue) => {
        safemodeActiveState.value = "transition";
        setTimeout(() => {
            safemodeActiveState.value = newValue ? "on" : "off";
        }, 100);
    });



    return {
        safemode,
        safemodeInterrupted,
        safemodeActive,
        safemodeActiveState,
        SharpEdgeBlurFilter,
        safemodeStyleSheet
    };
}