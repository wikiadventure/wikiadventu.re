import { useLocalStorage } from "@vueuse/core";

export const safemode = useLocalStorage("safemode", false);

export function useLocalSetting() {
    return {
        safemode,
    }
}

