<template>
  <q-select class="compact-lang-switch"
    v-model="locale" :options="allLangOptions"
    dense standout :display-value="langLabel"
    v-bind="$attrs" behavior="dialog">
    <template v-slot:prepend>
      <q-icon name="mdi-translate"></q-icon>
    </template>
  </q-select>
</template>
<style lang="scss">
.compact-lang-switch {
  .q-field__append {
    display: none;
  }
  .q-field__control {
    background: transparent!important;
  }
}
.body--dark {
  .compact-lang-switch {
    .q-field__control div {
      color: var(--wa-color-blue-white)!important;
    }
  }
}
.body--light {
  .compact-lang-switch {
    .q-field__control div {
      color: var(--wa-color-almost-black)!important;
    }
  }
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import { allLangOptions, langLabel } from 'src/i18n';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'LangSwitch',
  setup() {
    const { locale } = useI18n();
    return {
      locale,
      langLabel,
      allLangOptions
    }
  }
});
</script>