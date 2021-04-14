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
import TwitchBtn from "../../../components/form/TwitchButton.vue";
import ConnectForm from "../../../components/form/ConnectForm.vue";
import LangSelect from "../../../components/form/LanguageSelect.vue";
import PasswordInput from "../../../components/form/PasswordInput.vue";
import PseudoInput from "../../../components/form/PseudoInput.vue";
import GameLoopSelect from "../../../components/form/GameLoopSelect.vue";
import SlotSelect from "../../../components/form/SlotSelect.vue";
import { login, ConnectEvent, ConnectType } from "../../../mixins/connect";

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