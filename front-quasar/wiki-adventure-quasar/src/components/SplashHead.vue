<template>
    <div class="splash-container">
        <div class="splash">
            <h1 class="splash-head">WikiAdventure</h1>
            <p class="splash-subhead">
                a game of unlimited knowledge
            </p>
            <div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.splash-container {
    overflow: hidden;
    width: 100%;
    height: 88%;
    top: 0;
    left: 0;
    position: fixed !important;
}
    .body--dark .splash-container {
        background: var(--q-color-dark-blue);

    }
    .body--light .splash-container {
        background: var(--q-color-blue-white);
    }
.splash-head {
    font-size: 20px;
    margin: 10px;
	font-weight: 350;
	border-radius: 35px;
	padding: 1em 1.6em;
	border-radius: 5px;
    line-height: 1em;
}
    .body--dark .splash-head {
        color: #18a1c4;
        border: 3px solid #18a1c4;
        box-shadow: 0 0 25px #18a1c4, 0 0 25px #18a1c4 inset;
        text-shadow: 0 0 25px #18a1c4;
    }
    .body--light .splash-head {
        color: #0b2827;
        border: 3px solid #222;
        box-shadow: 0 0 25px #222, 0 0 25px #222 inset;
        text-shadow: 0 0 25px #222;
    }

.splash-subhead {
    letter-spacing: 0.05em;
    opacity: 0.8;
}
    .body--dark .splash-subhead {
        color: #ddd;
    }
    .body--light .splash-subhead {
        color: #222;
    }
.splash {
    width: 80%;
    height: 88%;
    margin: auto;
    position: absolute;
    top: 0px; left: 0; bottom: 0; right: 0;
    text-align: center;
    text-transform: uppercase;
}
@media (min-width: 1000px) {
    body {
        font-size: 16px;
    }
    .splash {
        width: 50%;
        height: 88%;
    }
    .splash-head {
        font-size: 250%;
    }
}
@media (min-width: 78em) {
    .splash-head {
        font-size: 300%;
    }
}
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SplashHead'
});
</script>
