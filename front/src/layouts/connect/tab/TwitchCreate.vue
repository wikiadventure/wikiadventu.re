<template>
  <connect-form :title="$t('menu.createTwitchLobby')">
    <lang-select class="col-12 col-sm-6 q-pa-sm"/>
    <pseudo-input class="col-12 col-sm-6 q-pa-sm"/>
    <password-input v-model="password" class="col-12 col-sm-6 q-pa-sm"/>
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
import IdInput from "../../../components/form/IdInput.vue";

import { defineComponent } from '@vue/composition-api';
import { ConnectEvent, ConnectType } from "../../../mixins/connectEvent";

export default defineComponent({
  name: 'TwitchCreate',
  components: { ConnectForm, TwitchBtn, LangSelect, PasswordInput, PseudoInput },
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
      this.$root.$emit("submit-form", connectEvent);
    }
  }
});
</script>