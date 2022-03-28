import { Ref } from "vue";


export default class TouchSurfaceHandler {
    touchSurface:HTMLElement;
    leftOpen?:Ref<boolean>;
    rightOpen?:Ref<boolean>;
    leftElement:any;
    rightElement:any;
    startX:number = 0;
    distX:number = 0;
    threshold:number;//minimum swipe amount of the touch surface to show element
    min:number;//minimum swipe amount of the touch surface to start transform
    isTouch:boolean;
    destroy:()=>void;
    constructor(touchSurface:HTMLElement, leftOpen?:Ref<boolean>, rightOpen?:Ref<boolean>, left?:any, right?:any) {
        this.touchSurface = touchSurface;
        this.leftOpen = leftOpen;
        this.rightOpen = rightOpen;
        this.leftElement = left;
        this.rightElement = right;
        this.threshold = .45;
        this.min = .15;
        this.isTouch = false;
        let touchStart = this.touchStart.bind(this);
        let touchMove = this.touchMove.bind(this);
        let touchEnd = this.touchEnd.bind(this);
        this.touchSurface.addEventListener('touchstart', touchStart, false);
        this.touchSurface.addEventListener('touchmove', touchMove, false);
        this.touchSurface.addEventListener('touchend', touchEnd, false);
        this.destroy = () => {
            this.touchSurface.removeEventListener('touchstart', touchStart, false);
            this.touchSurface.removeEventListener('touchmove', touchMove, false);
            this.touchSurface.removeEventListener('touchend', touchEnd, false);
        };
    }
    handleswipe(isRight:boolean, isLeft:boolean) {

        if (isRight && this.rightOpen?.value) this.rightOpen.value = false;
        else if (isLeft && this.leftOpen?.value) {
            this.leftOpen.value = false;
        } else if (!this.rightOpen?.value && !this.leftOpen?.value) {
            if (isLeft) {
                if (this.rightOpen != null) this.rightOpen.value = true;
            } else if (isRight) {
                if (this.leftOpen != null) this.leftOpen.value = true;
            }
        }
    }
    resetStyle(e:HTMLElement) {
        if (e) {
            e.style.transition = "transform ease-in-out 0.2s";
            e.style.transform = "";
        }
    }
    touchEnd(e:TouchEvent) {
        var touchobj = e.changedTouches[0];
        this.resetStyle(this.leftElement);
        this.resetStyle(this.rightElement);
        this.distX = touchobj.pageX - this.startX;
        var cap = this.threshold*this.touchSurface.clientWidth;
        var swipeRightBol = ( this.distX >= cap );
        var swipeLeftBol = ( this.distX <= -cap )
        this.handleswipe(swipeRightBol, swipeLeftBol);
        this.isTouch = false;
    }
    touchMove(e:TouchEvent) {
      var touchobj = e.changedTouches[0];
      this.distX = touchobj.pageX - this.startX;
      var tmin = this.touchSurface.clientWidth*this.min;
      if ( this.distX > tmin ) {
        var dist = this.distX-tmin;
        if (this.rightOpen && this.rightOpen.value) {
            if ( dist > this.rightElement.clientWidth ) dist = this.rightElement.clientWidth;
            this.rightElement.style.transform = "translate3d(" + (dist) + "px,0,0)";
            if (this.leftElement) this.leftElement.style.transform = ""; 
        }
        if (!this.leftOpen?.value && !this.rightOpen?.value) {
            if ( dist > this.leftElement.clientWidth ) dist = this.leftElement.clientWidth;
            this.leftElement.style.transform = "translate3d(" + (-this.leftElement.clientWidth+dist) + "px,0,0)";
            if (this.rightElement) this.rightElement.style.transform = ""; 
        }
      } else if ( this.distX < -tmin ) {
        var dist = this.distX+tmin;
        if (this.leftOpen && this.leftOpen.value) {
            if ( dist < -this.leftElement.clientWidth ) dist = -this.leftElement.clientWidth;
            this.leftElement.style.transform = "translate3d(" + (dist) + "px,0,0)";
            if (this.rightElement) this.rightElement.style.transform = ""; 
        }
        if (!this.leftOpen?.value && !this.rightOpen?.value) {
            if ( dist < -this.rightElement.clientWidth ) dist = -this.rightElement.clientWidth;
            this.rightElement.style.transform = "translate3d(" + (this.rightElement.clientWidth+dist) + "px,0,0)";
            if (this.leftElement) this.leftElement.style.transform = ""; 
        }
      }
    }
    touchStart(e:TouchEvent) {
        //if (this.isTouch) return;
        this.isTouch = true;
        var touchobj = e.changedTouches[0];
        this.distX = 0;
        this.startX = touchobj.pageX;
        if (this.leftElement) this.leftElement.style.transitionDuration = "0s";
        if (this.rightElement) this.rightElement.style.transitionDuration = "0s";
    }

}