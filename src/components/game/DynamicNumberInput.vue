<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useGameStore } from '../../stores/useGameStore';

const { isHost } = useGameStore();

const phase_duration = defineModel<number|undefined>({ required: true });

const props = defineProps<{
    input_display_name:string,
    min:number,
    max:number
}>();

const rawInputRef = ref((phase_duration.value??"").toString());

watch(phase_duration, (newValue) => {
    const parsedValue = parseFloat(rawInputRef.value);
    if (!isNaN(parsedValue)) {
        if (newValue != parsedValue) rawInputRef.value = newValue?.toString()!;
    }
})

const phaseDurationComputed = computed({
  get: () => phase_duration.value,
  set: (value:number|""|null) => {
    if (value != null && value !== "") {
        phase_duration.value = value;
    }
  }
});

function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    rawInputRef.value = input.value; // Capture the raw input value
    const parsedValue = parseFloat(input.value);
    if (!isNaN(parsedValue)) {
        phaseDurationComputed.value = parsedValue; // Update the model only if the value is a valid number
    }
};


</script>
<template>
<label class="dynamic-number-input">
    <span>{{ props.input_display_name }}: </span>
    <span :data-value="phaseDurationComputed">
        <span aria-hidden="true">{{ rawInputRef }}</span>
        <input :name="props.input_display_name.replaceAll(/\s*/g,'-')+'-dynamic-number-input'" 
            type="number" :disabled="!isHost" :min="props.min" :max="props.max"
            :value="rawInputRef"
            @input="handleInput"
        >
    </span>
</label>
</template>
<style>
.dynamic-number-input {
    
    display: inline-block;

    [aria-hidden="true"] {
        color: transparent;
    }


    > span[data-value] {
        position: relative;
        padding-right: 3ch;
    }
    > span > input {
        position: absolute;
        left: 0;
        width: 100%;
        background: transparent;
        color: var(--front-color);
        border: 1px solid #8888;
        border-radius: 4px 0 0 4px;
    }
}
</style>
