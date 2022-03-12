<template>
  <q-input outlined v-model="password" hint="" name="password"
          :label="t('password')" spellcheck="false"
          :dense="$q.screen.lt.sm" :type="isVisible ? 'password' : 'text'"
          v-bind="$attrs">
    <template v-slot:append>
      <q-icon :name="isVisible ? 'visibility_off' : 'visibility'"
              class="cursor-pointer" @click="isVisible = !isVisible">
      </q-icon>
    </template>
  </q-input>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
const password = ref('');
const isVisible = ref(false)
</script>
<i18n lang="yaml">
  en:
    password: "Password"
  fr:
    password: "Mot de passe"
</i18n>