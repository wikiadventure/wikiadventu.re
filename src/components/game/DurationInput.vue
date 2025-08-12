<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useClassicGameStore } from '../../stores/mode/classic/useClassic';

const { isHost, store } = useClassicGameStore();

const phase_duration = defineModel<number|undefined>({ required: true });

const props = defineProps<{
    phase_display_name:string
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
    console.log(input.value);
    rawInputRef.value = input.value; // Capture the raw input value
    const parsedValue = parseFloat(input.value);
    if (!isNaN(parsedValue)) {
        phaseDurationComputed.value = parsedValue; // Update the model only if the value is a valid number
    }
};


</script>
<template>
<div class="duration-input">
    <span>{{ props.phase_display_name }} duration in seconds: </span>
    <span :data-value="phaseDurationComputed">
        <span aria-hidden="true">{{ rawInputRef }}</span>
        <input :name="props.phase_display_name+'-duration-input'" 
            type="number" :disabled="!isHost" min="-1"
            :value="rawInputRef"
            @input="handleInput"
        >
    </span>
</div>
</template>
<style>
.duration-input {
    
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
    > span[data-value="-1"]  {

        > input {
            color: transparent;
            user-select: none;
            &::selection {
                color: transparent;
                background: transparent;
            }
        }
        &::after {
            content: "∞";
            padding-left: .5ch;
            position: absolute;
            left: 0;
        }
    }
}
</style>
