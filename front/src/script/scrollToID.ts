export function scrollToID(id:string, scrollContainer?:HTMLElement | Document) {
    if (!scrollContainer) scrollContainer = document;
    var element = scrollContainer.querySelector("#"+id);
    if (!element) return;
    element.scrollIntoView();
}