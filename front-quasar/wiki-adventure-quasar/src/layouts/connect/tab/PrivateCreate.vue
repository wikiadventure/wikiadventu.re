<template>
  <connect-form ref="PrivateCreate" createLobby :title="$t('menu.createPrivateLobby')">
    <connect-btn @click="submit" :label="$t('create')"/>
  </connect-form>
</template>
<style lang="scss">

</style>
<script lang="ts">
import ConnectBtn from "../../../components/form/ConnectButton.vue";
import ConnectForm from "../../../components/form/ConnectForm.vue";

import { defineComponent } from '@vue/composition-api';
import { ConnectEvent, ConnectType } from "../../../mixins/connectEvent";

export default defineComponent({
  name: 'PrivateCreate',
  components: { ConnectForm, ConnectBtn },
  methods: {
    submit() {
      var vm:any = this;
      var connectEvent:ConnectEvent = {
        type: ConnectType.PrivateCreate,
        password: vm.$refs.PrivateCreate.password
      }
      this.$root.$emit("submit-form", connectEvent);
    }
  }
});
</script>