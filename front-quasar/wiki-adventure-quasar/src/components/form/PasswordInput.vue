<template>
  <q-input outlined v-model="password" name="password" label="Password" spellcheck="false"
          :type="isPwd ? 'password' : 'text'" v-bind="$attrs" v-on="$listeners">
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