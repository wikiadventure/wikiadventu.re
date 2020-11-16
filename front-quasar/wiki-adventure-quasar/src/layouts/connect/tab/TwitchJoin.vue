<template>
  <connect-form ref="TwitchJoin" title="Join a Twitch lobby">
    <connect-btn @click="submit(false)" label="Join"/>
    <twitch-btn @click="submit(true)" :label="$q.screen.lt.sm ? 'Join' : 'Join with Twitch' "/>
  </connect-form>
</template>
<style lang="scss">

</style>
<script lang="ts">
import ConnectBtn from "../../../components/form/ConnectButton.vue";
import TwitchBtn from "../../../components/form/TwitchButton.vue";
import ConnectForm from "../../../components/form/ConnectForm.vue";

import { defineComponent } from '@vue/composition-api';
import { ConnectEvent, ConnectType } from "../../../mixins/connectEvent";

export default defineComponent({
  name: 'TwitchJoin',
  components: { ConnectForm, ConnectBtn, TwitchBtn },
  methods: {
    submit(withTwitch:boolean) {
      var vm:any = this;
      var connectEvent:ConnectEvent = {
        type: withTwitch ? ConnectType.TwitchJoinWith : ConnectType.TwitchJoinWithout,
        password: vm.$refs.TwitchJoin.password
      }
      this.$root.$emit("submit-form", connectEvent);
    }
  }
});
</script>