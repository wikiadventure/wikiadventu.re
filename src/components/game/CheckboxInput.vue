<script lang="ts" setup>
import { useGameStore } from '../../stores/useGameStore';

const { isHost } = useGameStore();

const input_model = defineModel<boolean|undefined>({ required: true });

const props = defineProps<{
    input_display_name:string
}>();


</script>
<template>
<label class="checkbox-input">
    <span>{{ props.input_display_name }}: </span>
    <input type="checkbox" :name="props.input_display_name.replaceAll(/\s+/g,'-')+'-checkbox-input'" 
        v-model="input_model" :disabled="!isHost"
    >
</label>
</template>
<style>
.checkbox-input {
    display: inline;
}
</style>
