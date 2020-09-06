/**
 * Allow you to swipe to open the tchat menu
 */

window.addEventListener('load', function() {
    
    var touchsurface = document.documentElement,
        startX,
        startY,
        dist,
        threshold = document.documentElement.clientWidth*0.5, //required min distance traveled to be considered swipe
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
        var uiSection = document.getElementById("uiSection");
            uiSection.style.transition = "";
        //startTime = new Date().getTime(); // record time when finger first makes contact with surface
    }, false);

    touchsurface.addEventListener('touchmove', function(e){
        var touchobj = e.changedTouches[0];
        dist = touchobj.pageX - startX;
        if ( dist > 0 && !document.getElementById("showUI").checked) {
            if ( dist > document.documentElement.clientWidth*0.8 ) dist = document.documentElement.clientWidth*0.8;
            var uiSection = document.getElementById("uiSection");
            uiSection.style.transform = "translateX(" + (-uiSection.clientWidth+dist) + "px)"; 
        }
        if ( dist <  -document.documentElement.clientWidth*0.15 && document.getElementById("showUI").checked) {
            if ( dist < -document.documentElement.clientWidth*0.8 ) dist = -document.documentElement.clientWidth*0.8;
            var uiSection = document.getElementById("uiSection");
            uiSection.style.transform = "translateX(" + (dist+document.documentElement.clientWidth*0.15) + "px)";
        }
    }, false);

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0];
        var uiSection = document.getElementById("uiSection");
            uiSection.style.transition = "all ease-in-out 0.2s";
            uiSection.style.transform = "";
        dist = touchobj.pageX - startX; // get total dist traveled by finger while in contact with surface
        //elapsedTime = new Date().getTime() - startTime; // get time elapsed
        // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
        var swipeRightBol = ( dist >= threshold );
        var swipeLeftBol = ( dist <= -threshold )
        handleswipe(swipeRightBol, swipeLeftBol);
    }, false);

}, false);
