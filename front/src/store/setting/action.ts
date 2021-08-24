import { computed } from 'vue';
import { safeMode, safeModeInterrupted } from './state';

export const safeModeActive = computed(()=>safeMode.value || safeModeInterrupted.value);