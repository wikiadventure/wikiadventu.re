import { LocalStorage, Dark } from 'quasar';

enum StoreKey {
    lightTheme = "lightTheme"
}

Dark.set(!LocalStorage.has(StoreKey.lightTheme));

//TODO: meaby we could also save user lang, player uuid

//TODO: make a gamemode config saver

export function save() {
    if (!Dark.isActive) !LocalStorage.has(StoreKey.lightTheme) && LocalStorage.set(StoreKey.lightTheme, null);
    else LocalStorage.has(StoreKey.lightTheme) && LocalStorage.remove(StoreKey.lightTheme); 
}
window.addEventListener("beforeunload", save);