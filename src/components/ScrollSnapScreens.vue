<script lang="ts" setup>

</script>
<template>
    <main class="scroll-snap-screens">
        <slot></slot>
    </main>
</template>
<style>
.scroll-snap-screens {
    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    height: 100%;
    width: 100%;
    overscroll-behavior-x: contain;
    > * {
        overflow-y: scroll;
        scroll-snap-align: center;
        flex: 0 0 100%;
        height: 100%;
    }
}
</style>
