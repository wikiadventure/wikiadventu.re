<template>
  <connect-form createLobby :title="$t('menu.createPrivateLobby')">
    <lang-select/>
    <password-input v-model="password"/>
    <pseudo-input/>
    <game-loop-select/>
    <slot-select/>
    <template v-slot:button>
      <connect-btn @click="submit" :label="$t('create')"/>
    </template>
  </connect-form>
</template>
<style lang="scss">

</style>
<script lang="ts">
import ConnectBtn from "../../../components/form/ConnectButton.vue";
import ConnectForm from "../../../components/form/ConnectForm.vue";
import LangSelect from "../../../components/form/LanguageSelect.vue";
import PasswordInput from "../../../components/form/PasswordInput.vue";
import PseudoInput from "../../../components/form/PseudoInput.vue";
import GameLoopSelect from "../../../components/form/GameLoopSelect.vue";
import SlotSelect from "../../../components/form/SlotSelect.vue";
import { login, ConnectEvent, ConnectType } from "../../../mixins/connect";

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PrivateCreate',
  components: { ConnectForm, ConnectBtn, LangSelect, PasswordInput, PseudoInput, GameLoopSelect, SlotSelect },
  data() {
    return {
      password: ""
    }
  },
  methods: {
    submit() {
      var vm:any = this;
      var connectEvent:ConnectEvent = {
        type: ConnectType.PrivateCreate,
        password: vm.password
      }
      login(connectEvent);
    }
  }
});
</script>