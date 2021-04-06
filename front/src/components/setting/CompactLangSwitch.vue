
<template>
  <q-select class="compact-lang-switch" @input="onSelect($event)"
    v-model="model" :options="options"
    dense standout :value="getLang" :display-value="getLang"
    v-bind="$attrs" v-on="$listeners" behavior="dialog">
    <template v-slot:prepend>
      <q-icon name="mdi-translate"></q-icon>
    </template>
  </q-select>
</template>
<style lang="scss">
.compact-lang-switch {
  .q-field__append {
    display: none;
  }
  .q-field__control {
    background: transparent!important;
  }
}
.compact-lang-switch {
  .q-field__control div {
    color: var(--wa-color-2)!important;
  }
}
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { getLabel, Lang } from '../../i18n';

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