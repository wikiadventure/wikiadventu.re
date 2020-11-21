<template>
  <connect-form ref="TwitchCreate" createLobby :title="$t('menu.createTwitchLobby')">
    <twitch-btn @click="submit" label="Create with Twitch"/>
  </connect-form>
</template>
<style lang="scss">

</style>
<script lang="ts">
import TwitchBtn from "../../../components/form/TwitchButton.vue";
import ConnectForm from "../../../components/form/ConnectForm.vue";

import { defineComponent } from '@vue/composition-api';
import { ConnectEvent, ConnectType } from "../../../mixins/connectEvent";

export default defineComponent({
  name: 'TwitchCreate',
  components: { ConnectForm, TwitchBtn },
  methods: {
    submit() {
      var vm:any = this;
      var connectEvent:ConnectEvent = {
        type: ConnectType.TwitchCreate,
        password: vm.$refs.TwitchCreate.password
      }
      this.$root.$emit("submit-form", connectEvent);
    }
  }
});
</script>