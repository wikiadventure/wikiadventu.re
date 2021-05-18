<template>
  <connect-form :title="$t('menu.joinTwitchLobby')">
    <id-input/>
    <password-input v-model="password"/>
    <pseudo-input/>
    <template v-slot:button>
      <connect-btn @click="submit(false)" :label="$t('join')"/>
      <twitch-btn @click="submit(true)" :label="$q.screen.lt.sm ? $t('join') : $t('menu.button.joinWithTwitch') "/>
    </template>
  </connect-form>
</template>
<style lang="scss">

</style>
<script lang="ts">
import ConnectBtn from 'src/components/form/ConnectButton.vue';
import TwitchBtn from 'src/components/form/TwitchButton.vue';
import ConnectForm from 'src/components/form/ConnectForm.vue';
import PasswordInput from 'src/components/form/PasswordInput.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import IdInput from 'src/components/form/IdInput.vue';
import { login, ConnectEvent, ConnectType } from 'src/mixins/connect';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TwitchJoin',
  components: { ConnectForm, ConnectBtn, TwitchBtn, PasswordInput, PseudoInput, IdInput },
  data() {
    return {
      password: ""
    }
  },
  methods: {
    submit(withTwitch:boolean) {
      var vm:any = this;
      var connectEvent:ConnectEvent = {
        type: withTwitch ? ConnectType.TwitchJoinWith : ConnectType.TwitchJoinWithout,
        password: vm.password
      }
      login(connectEvent);
    }
  }
});
</script>