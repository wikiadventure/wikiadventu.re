export default function scrollToID(id:string, scrollContainer?:Element) {
    var element = document.getElementById(id);
    if (!element) return;
    var top = element.offsetTop;
    top = top+document.documentElement.clientHeight*0.88;
    if (!scrollContainer) {
        window.scrollTo(0, top);
    } else {
        scrollContainer.scrollTo(0, top);
    }
    
    console.log(id + " scroll");
}