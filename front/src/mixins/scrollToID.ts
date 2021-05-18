export default function scrollToID(id:string, scrollContainer?:HTMLElement) {
    var element = scrollContainer.querySelector("#"+id);
    if (!element) return;
    element.scrollIntoView();
}