<template>
  <q-input outlined v-model="lobbyID" name="lobbyID" :label="$t('input.lobbyID')" spellcheck="false" v-bind="$attrs" v-on="$listeners"
  hint="">
  </q-input>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'IdInput',
  computed: {
    lobbyID: {
      get: function() {
        return this.$store.state.globalForm.lobbyID;
      },
      set: function(v) {
        this.$store.commit('globalForm/setLobbyID', v);
      }
    }
  }
});
</script>