<script lang="ts" setup>

</script>
<template>
<section>
    <h2>Help</h2>
    <p>
        You can shift + scroll or swipe verticaly on mobile to see  various game screen.
        Screen are in this order [Game control] | [Wiki playground] | [Wiki end page]
    </p>
    <p>
        There is also a popover menu to navigate to the different screen.
        You can it view by hovering the middle top of the window.
    </p>
</section>
</template>
<style>
.desktop-nav {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    min-width: 20ch;
    max-width: 85vw;
    min-height: 1.5lh;

    &:after {
        content: "";
        border: 2px solid var(--front-color);
        border-radius: 0 0 2px 2px;
    }

    > ul {
        margin: 0;
        padding: 0;
        list-style: none;
        position: relative;
        overflow: hidden;
        top: -3lh;
        transition: linear .2s top;
        display: flex;
        border-radius: 0 0 10px 10px;
        border: 1px solid grey;
        > li {
            flex: 1 1 max-content;
        }
        > li:not(:first-child) {
            border-left: 1px solid grey;
        }
        button {
            border: none;
            background: var(--back-color);
            color: var(--front-color);
            width: 100%;
            height: 100%;
            padding: 5px;
        }
        svg {
            vertical-align: middle;
        }

    }
    &:hover > ul {
        top: 0;

    }
}
@media screen and (width < 750px) {
    .desktop-nav {
        span {
            display: none;
        }
    }
}
</style>
