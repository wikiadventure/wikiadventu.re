import { safeModeActive } from "./action"
import { volume, mute, safeMode, safeModeInterrupted } from "./state"

export function settingSetup() {
    return {
      volume,
      mute,
      safeMode,
      safeModeInterrupted,
      safeModeActive
    }
}
