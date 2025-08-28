import { useLocalStorage } from "@vueuse/core";

export const safemode = useLocalStorage("safemode", true);

export function useLocalSetting() {
    return {
        safemode,
    }
}

