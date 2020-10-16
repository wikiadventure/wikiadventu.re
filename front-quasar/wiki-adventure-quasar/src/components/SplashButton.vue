<template>
    <q-btn class="s-btn shadow-24 q-mx-lg" v-bind="$attrs" v-on="$listeners"><slot></slot></q-btn>
</template>

<style scoped>
.s-btn {
    margin: 10px;
    font-size: 125%;
}
    .body--dark .s-btn {
        background: var(--w-color-almost-black);
        color: #18a1c4;       
    }
    .body--light .s-btn {
        background: var(--w-color-almost-black);
        color: var(--w-color-blue-white);
    }

</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SBtn'
});
</script>
