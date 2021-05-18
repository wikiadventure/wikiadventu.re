<template>
  <q-toggle class="darkModeToggle q-ma-none"
            v-model="theme"
            icon="mdi-lightbulb"
            size="lg"
            color="black">
  </q-toggle>
</template>
<style lang="scss">
.body--light {
  .darkModeToggle {
    .q-toggle__thumb:after {
      background: var(--wa-color-almost-black);
    }
    .q-icon {
      color: var(--wa-color-blue-white);
      opacity: 1;
    }
  }
}
.body--dark {
  .darkModeToggle {
    .q-toggle__thumb:after {
      background: var(--wa-color-almost-black);
    }
    .q-icon {
      color: var(--wa-color-dark-teal);
      opacity: 1;
    }
  }
}
</style>

<script lang="ts">
import { Dark } from 'quasar';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ThemeSwitch',
  computed: {
    theme: {
      get() {
        return Dark.isActive;
      },
      set(v:boolean) {
        Dark.set(v);
      }
    }
  }
});
</script>