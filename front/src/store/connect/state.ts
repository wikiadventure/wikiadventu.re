import { ref } from "vue";
import { Lang } from "src/i18n";
import { GameLoopType, VanillaLoopType } from "store/lobby/game/loop/type";
import { Quasar } from "quasar";
import { i18n } from "src/boot/i18n";

const localLang = Quasar.lang.getLocale();
var computedLocalLang = (localLang?.split("-")[0] || Lang.en) as Lang;
if (!Object.values(Lang).includes(computedLocalLang)) computedLocalLang = Lang.en;

export const lang = ref<Lang>(computedLocalLang);
export const pseudo = ref("");
export const id = ref("");
export const gameLoop = ref<GameLoopType>(VanillaLoopType.Classic);
export const slot = ref(10);
export const connecting = ref(false);