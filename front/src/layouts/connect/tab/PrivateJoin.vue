<template>
  <connect-form :title="$t('menu.joinPrivateLobby')">
    <id-input/>
    <password-input v-model="password"/>   
    <pseudo-input/>
    <template v-slot:button>
      <connect-btn @click="submit" :label="$t('join')"/>
    </template>
  </connect-form>
</template>
<style lang="scss">

</style>
<script lang="ts">
import ConnectBtn from "../../../components/form/ConnectButton.vue";
import ConnectForm from "../../../components/form/ConnectForm.vue";
import PasswordInput from "../../../components/form/PasswordInput.vue";
import PseudoInput from "../../../components/form/PseudoInput.vue";
import IdInput from "../../../components/form/IdInput.vue";
import { login, ConnectEvent, ConnectType } from "../../../mixins/connect";

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PrivateJoin',
  components: { ConnectForm, ConnectBtn, PasswordInput, PseudoInput, IdInput },
  data() {
    return {
      password: ""
    }
  },
  methods: {
    submit() {
      var vm:any = this;
      var connectEvent:ConnectEvent = {
        type: ConnectType.PrivateJoin,
        password: vm.password
      }
      login(connectEvent);
    }
  }
});
</script>
