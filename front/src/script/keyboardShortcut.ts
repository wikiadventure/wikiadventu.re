export type keyCombo = {
    ctrlKey?:boolean,
    altKey?:boolean,
    shiftKey?:boolean,
    key: string
}

export function newShortcut(f:()=>void, key:string, ctrlKey = false, altKey = false, shiftKey = false) {
    function k(e:KeyboardEvent) {
        if (!e.defaultPrevented &&
            e.ctrlKey == ctrlKey &&
            e.altKey == altKey &&
            e.shiftKey == shiftKey &&
            e.key == key) f();
    }
    document.addEventListener("keydown",k);
    return () => document.removeEventListener("keydown",k);
}