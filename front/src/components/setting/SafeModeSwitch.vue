<template>
  <q-toggle class="safeModeToggle q-ma-none"
            v-model="theme"
            checked-icon="check"
            unchecked-icon="clear"
            size="lg"
            color="black">
    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
      SafeMode will blur image of wikipedia, you can unblur image for the current page with ctrl + Q
    </q-tooltip>
  </q-toggle>
</template>
<style lang="scss">
.body--light {
  .safeModeToggle {
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
  .safeModeToggle {
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
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SafeModeSwitch',
  computed: {
    theme: {
      get() {
        return this.$store.state.gameData.safeMode;
      },
      set(b:boolean) {
        return this.$store.commit('gameData/safeMode', b);
      }
    }
  }
});
</script>