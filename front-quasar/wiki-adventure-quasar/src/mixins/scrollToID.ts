export default function scrollToID(id:string) {
    var element = document.getElementById(id);
    if (!element) return;
    var top = element.offsetTop;
    top = top+document.documentElement.clientHeight*0.88;
    window.scrollTo(0, top);
}