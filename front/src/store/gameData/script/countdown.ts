export default function animationInterval(ms:number, start:number, signal:AbortSignal, callback:(time:number)=>void) {
    // Prefer currentTime, as it'll better sync animtions queued in the 
    // same frame, but if it isn't supported, performance.now() is fine.
    function frame(time:number) {
      if (signal.aborted) return;
      callback(time);
      scheduleFrame(time);
    }
  
    function scheduleFrame(time:number) {
      const elapsed = time - start;
      const roundedElapsed = Math.round(elapsed / ms) * ms;
      const targetNext = start + roundedElapsed + ms;
      const delay = targetNext - performance.now();
      setTimeout(() => requestAnimationFrame(frame), delay);
    }
  
    scheduleFrame(start);
  }