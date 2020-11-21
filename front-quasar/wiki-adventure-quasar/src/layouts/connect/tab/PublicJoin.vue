<template>
    <connect-form ref="PublicJoin" publicLobby :title="$t('menu.joinPublicLobby')">
      <connect-btn @click="submit" :label="$t('join')"/>
    </connect-form>
</template>
<style lang="scss">

</style>
<script lang="ts">
import { ConnectEvent, ConnectType } from "../../../mixins/connectEvent"
import ConnectBtn from "../../../components/form/ConnectButton.vue";
import ConnectForm from "../../../components/form/ConnectForm.vue";

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PublicJoin',
  components: { ConnectForm, ConnectBtn },
  methods: {
    submit() {
      var vm:any = this;
      var connectEvent:ConnectEvent = {
        type: ConnectType.PublicJoin
      }
      this.$root.$emit("submit-form", connectEvent);
    }
  }
});
</script>