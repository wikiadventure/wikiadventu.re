<template>
    <q-btn class="submit-button" v-bind="$attrs" v-on="$listeners"/>
</template>
<style>
.submit-button {
  font-size: 150%;
}
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PasswordInput',
});
</script>