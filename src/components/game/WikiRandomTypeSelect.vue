<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useGameStore } from '../../stores/useGameStore';

const { isHost, store } = useGameStore();

const raw_grnminsize =  ref((store.gamedata.wiki_random.grnminsize??"").toString());

const grnminsize = computed({
  get: () => store.gamedata.wiki_random.grnminsize,
  set: (value:number|""|null) => {
    if (value != null && value !== "") {
        store.gamedata.wiki_random.grnminsize = value;
    }
  }
});

function handle_grnminsize(event: Event) {
    const input = event.target as HTMLInputElement;
    raw_grnminsize.value = input.value; // Capture the raw input value
    const parsedValue = parseFloat(input.value);
    if (!isNaN(parsedValue)) {
        store.gamedata.wiki_random.grnminsize = parsedValue; // Update the model only if the value is a valid number
    }
}


const raw_grnmaxsize = ref((store.gamedata.wiki_random.grnmaxsize??"").toString());

const grnmaxsize = computed({
  get: () => store.gamedata.wiki_random.grnmaxsize,
  set: (value:number|""|null) => {
    if (value != null && value !== "") {
        store.gamedata.wiki_random.grnmaxsize = value;
    }
  }
});

function handle_grnmaxsize(event: Event) {
    const input = event.target as HTMLInputElement;
    raw_grnmaxsize.value = input.value; // Capture the raw input value
    const parsedValue = parseFloat(input.value);
    if (!isNaN(parsedValue)) {
        store.gamedata.wiki_random.grnmaxsize = parsedValue; // Update the model only if the value is a valid number
    }
}


</script>
<template>
<fieldset class="wiki-random-type-select">
    <legend>Wiki random selection :</legend>
    <label class="number-input">
        <span>Minimum bytes size of random page : </span>
        <span :data-value="grnminsize">
            <span aria-hidden="true">{{ raw_grnminsize }}</span>
            <input type="number" :disabled="!isHost" min="-1"
                :value="raw_grnminsize"
                @input="handle_grnminsize"
            >
        </span>
    </label>
    <label class="number-input">
        <span>Maximum bytes size of random page: </span>
        <span :data-value="grnmaxsize">
            <span aria-hidden="true">{{ raw_grnmaxsize }}</span>
            <input type="number" :disabled="!isHost" min="-1"
                :value="raw_grnmaxsize"
                @input="handle_grnmaxsize"
            >
        </span>
    </label>
</fieldset>
</template>
<style>
.wiki-random-type-select {

    display: flex;
    flex-direction: column;
    gap: 1ch;
    justify-content: center;

     > .number-input {
    
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
                content: "∅";
                padding-left: .5ch;
                position: absolute;
                left: 0;
            }
        }
    }
}
</style>
