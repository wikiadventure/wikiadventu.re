<template>
  <q-input
    @input="onInput($event)" name="slot" outlined hint="" type="number"
    :label="'slot'" :value="getSlot" :min="2" :max="50"
    v-bind="$attrs" v-on="$listeners">
  </q-input>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SlotSelect',
  methods: {
    onInput(v:any) {
      this.$store.commit('globalForm/setSlot', v);
    }
  },
  computed: {
    getSlot():string {
      return this.$store.state.globalForm.slot;
    }
  }
});
</script>