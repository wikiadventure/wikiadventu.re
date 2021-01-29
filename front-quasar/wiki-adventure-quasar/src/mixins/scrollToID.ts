export default function scrollToID(id:string, scrollContainer?:string) {
    var element = document.querySelector('#'+scrollContainer+" #"+id);
    if (!element) return;
    element.scrollIntoView();
}