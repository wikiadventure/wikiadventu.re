export function scrollToID(id:string, scrollContainer?:HTMLElement | Document) {
    if (!scrollContainer) scrollContainer = document;
    //@ts-ignore
    var element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView();
}