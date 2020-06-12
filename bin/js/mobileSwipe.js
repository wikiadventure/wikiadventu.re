/**
 * Allow you to swipe to open the tchat menu
 */

window.addEventListener('load', function() {
    
    var touchsurface = document.documentElement,
        startX,
        startY,
        dist,
        threshold = 150, //required min distance traveled to be considered swipe
        allowedTime = 450, // maximum time allowed to travel that distance
        elapsedTime,
        startTime;

    function handleswipe(isRightSwipe, isLeftSwipe){
        if (isRightSwipe) {
            document.getElementById("showUI").checked = true;
        } else if (isLeftSwipe){
          document.getElementById("showUI").checked = false;
        }
    }

    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0];
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
    }, false);

    touchsurface.addEventListener('touchmove', function(e){
    }, false);

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0];
        dist = touchobj.pageX - startX; // get total dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
        var swipeRightBol = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchobj.pageY - startY) <= 100);
        var swipeLeftBol = (elapsedTime <= allowedTime && dist <= -threshold && Math.abs(touchobj.pageY - startY) <= 100)
        handleswipe(swipeRightBol, swipeLeftBol);
    }, false);

}, false);
