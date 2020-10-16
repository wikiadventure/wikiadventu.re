<template>
  <q-select
    @input="onSelect($event)" name="lang" outlined hint=""
    v-model="model" :options="options" label="select a language" 
    :value="gameLang" :display-value="gameLangLabel"
    v-bind="$attrs" v-on="$listeners"
  >
  </q-select>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { QSelect } from 'quasar';
import { Lang, getLabel } from '../../store/globalForm/state';

export default defineComponent({
  name: 'LangSelect',
  data() {
    return {
      model: null
    }
  },
  methods: {
    onSelect(event:any) {
      this.$store.commit('globalForm/setLang', event.value);
    }
  },
  computed: {
    options():Array<{ value:string, label:string }> {
      var optionsList:Array<{ value:string, label:string }> = [];
      for (var v in Lang) {
        var option:{ value:string, label:string } = {value: v, label: getLabel(v)};
        optionsList.push(option);
      }
      return optionsList;

    },
    gameLang():string {
      return this.$store.state.globalForm.lang.toString();
    },
    gameLangLabel():string {
     return getLabel(this.$store.state.globalForm.lang);
    }
  }
});
</script>