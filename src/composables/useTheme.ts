import { useLocalStorage, useWindowSize } from "@vueuse/core";
import { computed, watch } from "vue";

export const all_theme_value = ["os","light","dark"] as const;
export type Theme = typeof all_theme_value[number];

export const theme = useLocalStorage<Theme>("theme", "os");

document.body.setAttribute("theme", theme.value == "os" ? getUserColorScheme() : theme.value);

function getUserColorScheme() {
    if (typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        return 'dark-os';
    }
    return 'light-os';
}

watch(theme, (newTheme,_oldValue) => {
    document.body.setAttribute("theme", newTheme == "os" ? getUserColorScheme() : newTheme);
})


const { width } = useWindowSize();
export const isMobile = computed(() => width.value < 720);
