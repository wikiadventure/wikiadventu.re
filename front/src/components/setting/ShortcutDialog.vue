<template>
  <q-dialog v-model="open">
    <div class="shortcut-dialog">
      <exit-btn @click="open = false" />
      <div class="title">
        {{ $t("shortcut.title") }}
      </div>
      <q-separator/>
      <div class="shortcut-list">
        <div v-for="s in shortcuts" :key="s.combo">
          <div>{{ s.combo }}</div>
          <div>{{ s.desc }}</div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<style lang="scss">
  .shortcut-dialog {
    position: relative;
    width: Max(50%, 500px);
    max-width: 100%;
    height: 95%;
    margin: 1.25%;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--wa-color-dark-blue);
    @media screen and (max-width: 600px) {
      margin: 0;
      height: 100%;
      width: 100%;
      border-radius: 0;
    }
    .exit-btn {
      margin: 20px;
    }
  }
  .shortcut-list {
    display: flex;
    overflow-y: scroll;
    flex-direction: column;
    padding: 25px 5px;
    gap: 25px;
    &>div {
      flex: 0 1;
      width: 100%;
      display: flex;
      text-align: center;
      align-items: center;
      &>div:nth-child(1) {
        flex: 0 0 30%;
      }
      &>div:nth-child(2) {
        flex: 1 0;
      }
    }
  }
  .title {
    font-size: 2em;
    margin: 15px 5px;
    text-align: center;
  }
</style>
<script lang="ts">
import ExitBtn from "src/components/ExitButton.vue";

import { defineComponent } from '@vue/composition-api';
import { GameLoopType } from "src/store/gameData/type/gameLoop";

export default defineComponent({
  name: 'ShortcutDialog',
  components: { ExitBtn },
  data() {
    return {
      open: false
    }
  },
  computed: {
    shortcuts():Shortcut[] {
      switch (this.$store.state.gameData.gameLoop) {
        case GameLoopType.Classic:
        case GameLoopType.Random:
          return [ {
              combo: "ctrl + alt + shift",
              desc: this.$t("shortcut.openMenu") as string
            },
            {
              combo: "ctrl + alt + " + this.$t("shortcut.spaceKey"),
              desc: this.$t("shortcut.openEndPage") as string
            },
            {
              combo: "ctrl + alt + Q",
              desc: this.$t("shortcut.disableSafeMode") as string
            },
          ]
      }
    }
  }
});

interface Shortcut {
  combo:string,
  desc:string
}

</script>
