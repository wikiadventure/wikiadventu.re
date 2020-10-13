<template>
    <div class="content-wrapper">
        <slot></slot>
    </div>
</template>
<style>
    .content-wrapper {
        position: absolute;
        top: 87%;
        width: 100%;
        min-height: 12%;
        z-index: 2;
        box-shadow: 0px 15px 25px 25px rgba(0,0,0,0.5);
    }
    .body--dark .content-pannel:nth-child(odd) {
        background: var(--q-color-almost-black);
        color: var(--q-color-blue-white);
    }
    .body--dark .content-pannel:nth-child(even) {
        background: var(--q-color-dark-blue);
        color: var(--q-color-dark-teal);
    }
    .body--light .content-pannel:nth-child(odd) {
        background: var(--q-color-teal);
        color: var(--q-color-almost-black); 
    }
    .body--light .content-pannel:nth-child(odd) .submit-button {
        background: var(--q-color-almost-black);
        color: var(--q-color-teal);
    }    
    .body--light .content-pannel:nth-child(even) {
        background: var(--q-color-blue-white);
        color: var(--q-color-almost-black);
    }
    .body--light .content-pannel:nth-child(even) .submit-button {
        background: var(--q-color-almost-black);
        color: var(--q-color-blue-white);
    }
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ContentWrapper'
});
</script>