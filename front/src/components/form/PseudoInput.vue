<template>
  <q-input outlined v-model="pseudo" :label="$t('input.pseudo')"
          name="pseudo" spellcheck="false" v-bind="$attrs" v-on="$listeners"
          :rules="[ val => val && val.length >= 3 || '3 character minimum',
                    val => val && val.length <= 25 || '25 character maximum',
                    val => val && !val.match(/[<>:|%$\/\\]/g) || 'Don\'t use any of this character < > : | % $ / \\']">
    <template v-slot:append>
      <q-icon class="iconButton" name="mdi-dice-5" @click="randomizePseudo()"></q-icon>
    </template>
  </q-input>
</template>
<style scoped>
.iconButton {
  transition: transform 0.2s ease-in-out;
}
.iconButton:hover {  
  transform: scale(1.2);
}
.iconButton:active {
  transform: scale(1) rotate(360deg);
}
</style>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'PseudoInput',
  methods: {
    randomizePseudo() {
      this.$store.commit('globalForm/randomizePseudo');
    }
  },
  computed: {
    pseudo: {
      get: function() {
        return this.$store.state.globalForm.pseudo;
      },
      set: function(v) {
        this.$store.commit('globalForm/setPseudo', v);
      }
	  }
  }
});
</script>