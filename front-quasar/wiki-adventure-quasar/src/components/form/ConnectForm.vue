<template>
    <div class="connect-form">
      <h3 class="formTitle">{{ title }}</h3>
        <q-form>
        <div class="row">
          <div class="col-12 col-sm-6">
              <lang-select class="q-ma-sm" popup-content-class="odd-select-popup"/>
              <pseudo-input class="q-ma-sm"/>
          </div>
          <div class="col-12 col-sm-6">
                <id-input v-if="!createLobby" class="q-ma-sm"/>
                <password-input v-model="password" v-if="!publicLobby" class="q-ma-sm"/>
                
          </div>
        </div>
        <div class="row justify-evenly q-my-lg">
          <slot></slot>
        </div>
        </q-form>
      </div>
</template>
<style lang="scss">
.formTitle {
  text-align: center;
  @media(max-width: 720px) {
    margin: 2px;
    font-size: 2.5em;
  }
}
</style>
<script lang="ts">
import LangSelect from "components/form/LanguageSelect.vue";
import PseudoInput from "components/form/PseudoInput.vue";
import PasswordInput from "components/form/PasswordInput.vue";
import IdInput from "components/form/IdInput.vue";

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ConnectForm',
  components: { LangSelect, PseudoInput, PasswordInput, IdInput },
  props: {
    publicLobby: Boolean,
    createLobby: Boolean,
    title: String
  },
  data() {
    return {
      password: ""
    }
  }

});
</script>