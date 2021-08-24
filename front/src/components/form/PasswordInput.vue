<template>
  <q-input outlined v-model="password" hint="" name="password"
          :label="t('input.password')" spellcheck="false"
          :dense="$q.screen.lt.sm" :type="isPwd ? 'password' : 'text'"
          v-bind="$attrs">
    <template v-slot:append>
      <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer" @click="isPwd = !isPwd">
      </q-icon>
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'PasswordInput',
  setup () {
    const { t } = useI18n();
    const password = ref('');
    const isVisible = ref(false)
    return {
      password,
      isVisible,
      t
    }
  }
});
</script>