<template>
  <connect-form :title="$t('menu.createTwitchLobby')">
    <lang-select/>
    <pseudo-input/>
    <password-input v-model="password"/>
    <game-loop-select/>
    <slot-select/>
    <template v-slot:button>
      <twitch-btn @click="submit" :label="$t('menu.button.createWithTwitch')"/>
    </template>
  </connect-form>
</template>
<style lang="scss">

</style>
<script lang="ts">
import TwitchBtn from 'src/components/form/TwitchButton.vue';
import ConnectForm from 'src/components/form/ConnectForm.vue';
import LangSelect from 'src/components/form/LanguageSelect.vue';
import PasswordInput from 'src/components/form/PasswordInput.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import GameLoopSelect from 'src/components/form/GameLoopSelect.vue';
import SlotSelect from 'src/components/form/SlotSelect.vue';
import { login, ConnectEvent, ConnectType } from 'src/mixins/connect';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TwitchCreate',
  components: { ConnectForm, TwitchBtn, LangSelect, PasswordInput, PseudoInput, GameLoopSelect, SlotSelect },
  data() {
    return {
      password: ""
    }
  },
  methods: {
    submit() {
      var vm:any = this;
      var connectEvent:ConnectEvent = {
        type: ConnectType.TwitchCreate,
        password: vm.password
      }
      login(connectEvent);
    }
  }
});
</script>