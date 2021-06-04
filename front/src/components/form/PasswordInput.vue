<template>
  <q-input outlined v-model="password" hint="" name="password"
          :label="$t('input.password')" spellcheck="false"
          :dense="$q.screen.lt.sm" :type="isPwd ? 'password' : 'text'"
          v-bind="$attrs" v-on="$listeners">
    <template v-slot:append>
      <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer" @click="isPwd = !isPwd">
      </q-icon>
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PasswordInput',
  data () {
    return {
      password: '',
      isPwd: true
    }
  }
});
</script>