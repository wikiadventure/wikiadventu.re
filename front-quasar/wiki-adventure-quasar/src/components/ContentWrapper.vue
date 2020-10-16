<template>
    <div class="content-wrapper">
        <slot></slot>
    </div>
</template>
<style lang="scss">
    .content-wrapper {
        position: absolute;
        top: 87%;
        width: 100%;
        min-height: 12%;
        z-index: 2;
        box-shadow: 0px 15px 25px 25px rgba(0,0,0,0.5);
    }
    .body--dark {
        .content-pannel:nth-child(odd){
            background: var(--w-color-almost-black);
            color: var(--w-color-blue-white);
            .submit-button {
                background: var(--w-color-blue-white);
                color: var(--w-color-almost-black);
            }
            .q-field--outlined .q-field__control:before {
                border-color: var(--w-color-blue-white);
            }
            .q-field__marginal, .q-field__label, .q-field__native {
                color: var(--w-color-blue-white);
            }
        }
        .content-pannel:nth-child(even){
            background: var(--w-color-dark-blue);
            color: var(--w-color-dark-teal);
            .submit-button {
                background: var(--w-color-dark-teal);
                color: var(--w-color-dark-blue);
            }
            .q-field--outlined .q-field__control:before {
                border-color: var(--w-color-dark-teal);
            }
            .q-field__marginal, .q-field__label, .q-field__native {
                color: var(--w-color-dark-teal);
            }
        }
    }
    .body--light {
        .content-pannel:nth-child(odd){
            background: var(--w-color-teal);
            color: var(--w-color-almost-black); 
            .submit-button {
                background: var(--w-color-almost-black);
                color: var(--w-color-teal);
            }
            .q-field--outlined .q-field__control:before {
                border-color: var(--w-color-blue-white);
            }
            .q-field__marginal, .q-field__label, .q-field__native {
                color: var(--w-color-blue-white);
            }
        }
        .content-pannel:nth-child(even){
            background: var(--w-color-blue-white);
            color: var(--w-color-almost-black);
            .submit-button {
                background: var(--w-color-almost-black);
                color: var(--w-color-blue-white);
            }
            .q-field--outlined .q-field__control:before {
                border-color: var(--w-color-blue-white);
            }
            .q-field__marginal, .q-field__label, .q-field__native {
                color: var(--w-color-blue-white);
            }
        }
    }
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ContentWrapper'
});
</script>