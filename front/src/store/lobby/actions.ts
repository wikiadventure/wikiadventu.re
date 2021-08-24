import { time, timeController, timeLeft, timeStamp } from "./state";

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

export function startTimer() {
  timeController.value.abort();
  timeController.value = new AbortController();
  timeStamp.value = document?.timeline.currentTime ? document?.timeline.currentTime : performance.now();
  timeLeft.value = formatTimer(time.value);
  animationInterval(100, timeStamp.value, timeController.value.signal, t => {
    const left = time.value - (t - timeStamp.value)
    timeLeft.value = formatTimer(left);
    if (left <= 0) {
      timeController.value.abort();
      timeController.value = new AbortController();
    }
  });
}

export function formatTimer(t:number) {
  return t > 0 ? Math.round(t/1000) : 0;
}
