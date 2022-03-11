import { Ref } from 'vue';

export function animationInterval(ms:number, start:number, signal:AbortSignal, callback:(time:number)=>void) {
  // Prefer currentTime, as it'll better sync animtions queued in the 
  // same frame, but if it isn't supported, performance.now() is fine.
  function frame(t:number) {
    if (signal.aborted) return;
    callback(t);
    scheduleFrame(t);
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

export function startDynamicTimer(timeController:Ref<AbortController>, timeStamp:Ref<number>, timeLeft:Ref<number>, time?:Ref<number>) {
  timeController.value.abort();
  timeController.value = new AbortController();
  timeStamp.value = document?.timeline.currentTime ? document?.timeline.currentTime : performance.now();
  if (time) {
    timeLeft.value = formatTimer(time.value);
    animationInterval(100, timeStamp.value, timeController.value.signal, t => {
      const left = time.value - (t - timeStamp.value)
      timeLeft.value = formatTimer(left);
      if (left <= 0) {
        timeController.value.abort();
        timeController.value = new AbortController();
      }
    });
  } else {
    // The timeleft is the timespend
    // In this case the timeleft goes up
    timeLeft.value = 0;
    animationInterval(100, timeStamp.value, timeController.value.signal, t => {
        const left = (t - timeStamp.value)
        timeLeft.value = formatTimer(left);
    });
  }

}

export function formatTimer(t:number) {
  return t > 0 ? Math.round(t/1000) : 0;
}
