<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useGameStore } from '../../stores/useGameStore';
import type { DurationInput } from '../../stores/game';

const { isHost } = useGameStore();
// duration is an object ref with a value and a unit field
// need .value.value to access it
const duration = defineModel<DurationInput>({ required: true });

// Create computed refs for easier access to nested properties
const durationValue = computed({
    get: () => duration.value.value,
    set: (val) => {
        duration.value = {
            value: val,
            unit: unit.value
        }
    }
});

const unit = computed({
    get: () => duration.value.unit,
    set: (val) => {
        duration.value = {
            value: durationValue.value,
            unit: val
        }
    }
});

const props = defineProps<{
    duration_display_name:string
}>();

const rawInputRef = ref((duration.value.value??"").toString());

watch(duration, (newDuration:DurationInput) => {
    rawInputRef.value = newDuration.value?.toString()!;
})

const durationComputed = computed({
    get: () => duration.value,
    set: (value:number|""|null) => {
        if (value == null || value === "") return;
        durationValue.value = Number(value) < 0 ? -1 : Number(value);
    }
});

function handleInput(event: Event) {

    const input = event.target as HTMLInputElement;
    if (input.value.length > 8) {
        input.value = input.value.slice(0, 8);
    }
    if (input.value === "") {

    } else {
        rawInputRef.value = input.value; // Capture the raw input value
    }
    const parsedValue = parseFloat(input.value);
    if (!isNaN(parsedValue)) {
        durationComputed.value = parsedValue; // Update the model only if the value is a valid number
    }
};


</script>
<template>
<div class="duration-input">
    <label>
        <span>{{ props.duration_display_name }} duration: </span>
        <span :data-value="durationComputed">
            <span aria-hidden="true">{{ rawInputRef }}</span>
            <input :name="props.duration_display_name.replaceAll(/\s+/g,'-')+'-duration-input-value'" 
                type="number" :disabled="!isHost" min="-1" max="99999999"
                inputmode="decimal"
                :value="rawInputRef"
                onkeydown="return !['e', 'E'].includes(event.key)"
                @input="handleInput"
            >
        </span>
    </label>
    <select :name="props.duration_display_name.replaceAll(/\s+/g,'-')+'-duration-input-unit'" 
            v-model="unit" aria-label="Choose a duration unit" :disabled="!isHost">
        <option value="seconds">seconds</option>
        <option value="minutes">minutes</option>
        <option value="hours">hours</option>
    </select>
</div>
</template>
<style>
.duration-input {
    
    display: inline-block;

    [aria-hidden="true"] {
        color: transparent;
        min-width: 4ch;
        font-size: 1rem;
        max-width: 60vw;
        padding-right: 2ch;
        display: inline-block;
    }


    label > span[data-value] {
        position: relative;
        padding-right: 2ch;
    }
    label > span > input {
        position: absolute;
        left: 0;
        width: 100%;
        font-size: 1rem;
        background: transparent;
        color: var(--front-color);
        border: 1px solid #8888;
        border-radius: 4px 0 0 4px;
        min-width: 6ch;
    }
    label > span[data-value="-1"]  {
        &::after {
            content: " (∞)";
        }
    }
    > select {
        font-size: 1rem;
        background: var(--back-color);
        color: var(--front-color);
    }
}
</style>
