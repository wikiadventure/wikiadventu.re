<template>
  <q-toggle class="safeModeToggle q-ma-none"
            v-model="safeMode"
            checked-icon="check"
            unchecked-icon="clear"
            size="lg"
            color="black">
    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
      {{ t("settingTab.safeModeTooltip") }}
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
import { safeMode } from 'store/setting/state';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'SafeModeSwitch',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return {
      safeMode,
      t
    }
  }
});
</script>