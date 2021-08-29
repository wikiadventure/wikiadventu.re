import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages, { Lang } from 'src/i18n';
import { Quasar } from 'quasar';
import type { MessageSchema, SupportedLang } from "src/i18n";

var localLang = Quasar.lang.getLocale();
var computedLocalLang = localLang?.split("-")[0] || "en";

const i18n = createI18n<[MessageSchema], SupportedLang>({
  //globalInjection: true,
  legacy: false,
  locale: computedLocalLang,
  fallbackLocale: Lang.en,
  messages,
});


export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n };
