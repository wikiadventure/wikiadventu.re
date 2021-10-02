<template>
  <q-dialog v-model="open">
    <div class="shortcut-dialog">
      <exit-btn @click="open = false" />
      <div class="title">
        {{ t("shortcut.title") }}
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
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    width: Max(50%, 500px);
    max-width: 100%;
    height: 95%;
    margin: 1.25%;
    background: var(--clr-alt);
    border-radius: 6px;
    @media screen and (max-width: 600px) {
      height: 100%;
      width: 100%;
      margin: 0;
      border-radius: 0;
    }
    .exit-btn {
      margin: 20px;
    }
  }
  .shortcut-list {
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 25px 5px;
    &>div {
      flex: 0 1;
      display: flex;
      width: 100%;
      align-items: center;
      text-align: center;
      &>div:nth-child(1) {
        flex: 0 0 30%;
      }
      &>div:nth-child(2) {
        flex: 1 0;
      }
    }
  }
  .title {
    margin: 15px 5px;
    font-size: 2em;
    text-align: center;
  }
</style>
<script lang="ts">
import { i18n } from "src/boot/i18n";
import ExitBtn from "src/components/ExitButton.vue";
import { GameLoopType, VanillaLoopType } from "store/lobby/game/loop/type";
import { gameLoop } from "store/lobby/state";

import { defineComponent, ref, computed } from 'vue';
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: 'ShortcutDialog',
  components: { ExitBtn },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const open = ref(false);

    const shortcuts = computed(() => {
      var shortcuts = [];
      shortcuts.push(
        {
          combo: "ctrl + alt + shift",
          desc: t("shortcut.openMenu")
        },
        {
          combo: "ctrl + alt + Q",
          desc: t("shortcut.disableSafeMode")
        }
      );
      if (hasEndPage.includes(gameLoop.value)) {
        shortcuts.push(
          {
            combo: "ctrl + alt + " + t("shortcut.spaceKey"),
            desc: t("shortcut.openEndPage") as string
          }
        )
      }
      return shortcuts;
    });

    return {
      open,
      shortcuts,
      t
    }
  }
});

const hasEndPage:GameLoopType[] = [VanillaLoopType.Classic, VanillaLoopType.Random];

interface Shortcut {
  combo:string,
  desc:string
}

</script>
