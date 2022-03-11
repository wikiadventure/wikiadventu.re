import { startDynamicTimer } from "src/script/timer";
import { time, timeController, timeLeft, timeStamp } from "./state";

export function startTimer() {
  startDynamicTimer(timeController, timeStamp, timeLeft, time);
}
