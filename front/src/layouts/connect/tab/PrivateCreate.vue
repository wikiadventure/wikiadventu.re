<template>
  <connect-form createLobby :title="t('menu.createPrivateLobby')">
    <lang-select/>
    <password-input v-model="password"/>
    <pseudo-input/>
    <game-loop-select/>
    <slot-select/>
    <template v-slot:button>
      <connect-btn @click="submit" :label="t('create')"/>
    </template>
  </connect-form>
</template>
<style lang="scss">

</style>
<script lang="ts">
import ConnectBtn from 'src/components/form/ConnectButton.vue';
import ConnectForm from 'src/components/form/ConnectForm.vue';
import GameLoopSelect from 'src/components/form/GameLoopSelect.vue';
import LangSelect from 'src/components/form/LanguageSelect.vue';
import PasswordInput from 'src/components/form/PasswordInput.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import SlotSelect from 'src/components/form/SlotSelect.vue';
import { login } from 'store/connect/action';
import { ConnectEvent, ConnectType } from 'store/connect/type';
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';


export default defineComponent({
  name: 'PrivateCreate',
  components: { ConnectForm, ConnectBtn, LangSelect, PasswordInput, PseudoInput, GameLoopSelect, SlotSelect },
  setup() {
    const { t } = useI18n();
    const password = ref("");
    return {
      password,
      t
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