<template>
  <connect-form :title="$t('menu.joinPublicLobby')">
    <lang-select class="col-12 col-sm-6 q-pa-sm"/>
    <id-input class="col-12 col-sm-6 q-pa-sm"/>
    <pseudo-input class="col-12 col-sm-6 q-pa-sm"/>
    <password-input v-model="password" class="col-12 col-sm-6 q-pa-sm"/>
    <template v-slot:button>
      <connect-btn @click="submit" :label="$t('join')"/>
    </template>
  </connect-form>
</template>
<style lang="scss">

</style>
<script lang="ts">
import { ConnectEvent, ConnectType } from "../../../mixins/connectEvent"
import ConnectBtn from "../../../components/form/ConnectButton.vue";
import ConnectForm from "../../../components/form/ConnectForm.vue";
import LangSelect from "../../../components/form/LanguageSelect.vue";
import PasswordInput from "../../../components/form/PasswordInput.vue";
import PseudoInput from "../../../components/form/PseudoInput.vue";
import IdInput from "../../../components/form/IdInput.vue";

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PublicJoin',
  components: { ConnectForm, ConnectBtn, LangSelect, PasswordInput, PseudoInput, IdInput },
  data() {
    return {
      password: ""
    }
  },
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