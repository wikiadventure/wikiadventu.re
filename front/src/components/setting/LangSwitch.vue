
<template>
  <q-select @input="onSelect($event)" outlined
    v-model="model" :options="options"
    :value="getLang" :display-value="getLangLabel"
    v-bind="$attrs" v-on="$listeners" behavior="dialog">
    <template v-slot:prepend>
      <q-icon name="mdi-translate"></q-icon>
    </template>
  </q-select>
</template>
<style lang="scss">
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { getLabel, Lang } from 'src/i18n';

export default defineComponent({
  name: 'LangSwitch',
   data() {
    return {
      model: null
    }
  },
  methods: {
    onSelect(event:any) {
      this.$i18n.locale = event.value;
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
    getLang():string {
      return this.$i18n.locale;
    },
    getLangLabel():string {
     return getLabel(this.$i18n.locale);
    }
  }
});
</script>