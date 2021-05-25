

export default class TouchSurfaceHandler {
    touchSurface:HTMLElement;
    vm:any;
    startX:number;
    distX:number;
    threshold:number;//minimum swipe amount of the touch surface to show element
    min:number;//minimum swipe amount of the touch surface to start transform
    isTouch:boolean;
    constructor(touchSurface:HTMLElement, vm:any) {
        this.touchSurface = touchSurface;
        this.vm = vm;
        this.threshold = .45;
        this.min = .15;
        this.isTouch = false;
        this.touchSurface.addEventListener('touchstart', (e) => this.touchStart(e), false);

        this.touchSurface.addEventListener('touchmove', (e) => this.touchMove(e), false);
    
        this.touchSurface.addEventListener('touchend', (e) => this.touchEnd(e), false);
    }
    handleswipe(isRight:boolean, isLeft:boolean) {
        if (isRight && this.vm.showRightPanel) this.vm.showRightPanel = false;
        else if (isLeft && this.vm.gameMenu) {
            this.vm.gameMenu = false;
        } else if (!this.vm.showRightPanel && !this.vm.gameMenu) {
            if (isLeft) {
                this.vm.showRightPanel = true;
            } else if (isRight) this.vm.gameMenu = true;
        }
    }
    resetStyle(e:HTMLElement) {
        e.style.transition = "all ease-in-out 0.2s";
        e.style.transform = "";
    }
    touchEnd(e:TouchEvent) {
        var touchobj = e.changedTouches[0];
        this.resetStyle(this.vm.$refs.game.$refs.menu.$el);
        this.resetStyle(this.vm.$refs.rightPanel.$el);
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
        if (this.vm.showRightPanel) {
            if ( dist < -this.vm.$refs.rightPanel.$el.clientWidth ) dist = this.vm.$refs.rightPanel.$el.clientWidth;
            this.vm.$refs.rightPanel.$el.style.transform = "translate3d(" + (dist) + "px,0,0)";
        }
        if (!this.vm.gameMenu && !this.vm.showRightPanel) {
            if ( dist > this.vm.$refs.game.$refs.menu.$el.clientWidth ) dist = this.vm.$refs.game.$refs.menu.$el.clientWidth;
            this.vm.$refs.game.$refs.menu.$el.style.transform = "translate3d(" + (-this.vm.$refs.game.$refs.menu.$el.clientWidth+dist) + "px,0,0)"; 
        }
      } else if ( this.distX < -tmin ) {
        var dist = this.distX+tmin;
        if (this.vm.gameMenu) {
            if ( dist > this.vm.$refs.game.$refs.menu.$el.clientWidth ) dist = -this.vm.$refs.game.$refs.menu.$el.clientWidth;
            this.vm.$refs.game.$refs.menu.$el.style.transform = "translate3d(" + (dist) + "px,0,0)";
        }
        if (!this.vm.gameMenu && !this.vm.showRightPanel) {
            if ( dist > this.vm.$refs.rightPanel.$el.clientWidth ) dist = -this.vm.$refs.rightPanel.$el.clientWidth;
            this.vm.$refs.rightPanel.$el.style.transform = "translate3d(" + (this.vm.$refs.rightPanel.$el.clientWidth+dist) + "px,0,0)"; 
        }
      }
    }
    touchStart(e:TouchEvent) {
        //if (this.isTouch) return;
        this.isTouch = true;
        var touchobj = e.changedTouches[0];
        this.distX = 0;
        this.startX = touchobj.pageX;
        this.vm.$refs.game.$refs.menu.$el.style.transition = "all ease-in-out 0.0s";
        this.vm.$refs.rightPanel.$el.style.transition = "all ease-in-out 0.0s";
    }

}