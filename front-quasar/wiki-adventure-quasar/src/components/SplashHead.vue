<template>
    <div class="splash-container justify-center">
      <div class="row q-mt-lg justify-center constraint">
        <h1 class="splash-head col-auto q-pa-lg">WikiAdventure</h1>
      </div>
      <p class="splash-subhead q-ma-none row justify-center constraint">
        a game of unlimited knowledge
      </p>
      <div class="row justify-center constraint">
        <q-toggle class="darkModeToggle q-ma-none"
                  @input="switchMode"
                  v-model="darkModeToggle"
                  icon="mdi-lightbulb"
                  size="xl"
                  color="black">
        </q-toggle>
      </div>
      <div class="fillSpace justify-evenly">
        <slot></slot>
      </div>
    </div>
</template>

<style lang="scss">
.constraint {
flex: 0 0 auto;
}
.fillSpace {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.body--light {
  .darkModeToggle {
    .q-toggle__thumb:after {
      background: var(--w-color-almost-black);
    }
    .q-icon {
      color: var(--w-color-blue-white);
      opacity: 1;
    }
  }
}
.body--dark {
  .darkModeToggle {
    .q-toggle__thumb:after {
      background: var(--w-color-almost-black);
    }
    .q-icon {
      color: var(--w-color-dark-teal);
      opacity: 1;
    }
  }
}
.splash-container {
    overflow: hidden;
    width: 100%;
    height: 88%;
    //min-height: 550px;
    top: 0;
    left: 0;
    position: fixed !important;
    text-align: center;
    text-transform: uppercase;
    display: flex;
    flex-flow: column;
}
    .body--dark .splash-container {
        background: var(--w-color-dark-blue);

    }
    .body--light .splash-container {
        background: var(--wiki-color-blue-white);
    }
.splash-head {
    font-size: 250%;
    margin: 10px;
    line-height: 100%;
	  font-weight: 350;
	  border-radius: 5px;
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
/*@media (min-width: 1024px) {
    .splash-head {
        font-size: 250%;
    }
}*/
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Dark } from 'quasar';

export default defineComponent({
  name: 'SplashHead',
  data() {
    return {
      darkModeToggle: true
    }
  },
  methods: {
    switchMode(value:any, evt:Object) {
      console.log(value);
      Dark.set(value);
    }
  }
});
</script>
