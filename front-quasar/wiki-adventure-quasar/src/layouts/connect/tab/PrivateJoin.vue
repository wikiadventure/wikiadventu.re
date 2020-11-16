<template>
    <connect-form ref="PrivateJoin" title="Join a private lobby">
      <connect-btn @click="submit" label="Join"/>
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
  name: 'PrivateJoin',
  components: { ConnectForm, ConnectBtn },
  methods: {
    submit() {
      var vm:any = this;
      var connectEvent:ConnectEvent = {
        type: ConnectType.PrivateJoin,
        password: vm.$refs.PrivateJoin.password
      }
      this.$root.$emit("submit-form", connectEvent);
    }
  }
});
</script>
