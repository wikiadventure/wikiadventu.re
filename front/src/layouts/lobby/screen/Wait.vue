<template>
  <div class="wait-screen row justify-center absolute-full">
    <div class="wait-container shadow-6">
      <div class="wait-slot justify-center">
        {{ players.length }} / {{ slot }}
      </div>
      <q-separator/>
      <div class="wait-players">
        <div v-for="player in players" :key="player.id">
          <div>
            <q-icon :class="{ invisible: player.id != ownerId }" size="xs" class="owner" name="mdi-crown"/>
          </div>
          <div :class="{ self: player.id == selfId }">{{ player.pseudo }}</div>
        </div>
      </div>
      <q-separator/>
      <div class="wait-action justify-evenly">
        <q-btn push class="action-btn-alt" :label="t('invite')" @click="invite()" icon="mdi-link-variant"/>
        <div><!--Only to display tooltip over the disabled q btn -->
        <!--TODO: translate this -->
          <q-btn :disable="!isOwner" push class="action-btn-alt" :label="t('start')" @click="sendStart()" icon="mdi-check-bold"/>
          <q-tooltip v-if="!isOwner"  anchor="top middle" self="bottom middle" :offset="[10, 10]">
            Only <q-icon size="xs" class="owner" name="mdi-crown"/> {{ owner?.pseudo }} can choose to start
          </q-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.wait-screen {
  overflow: hidden;
  .wait-container {
    background: var(--clr-alt);
  }
  .wait-players {
    >div {
      background: hsla(0,0%,50%,0.15);
      div {
        color: var(--clr-reverse);
      }
    }
  }
  .wait-container {
    width: Max(50%, 500px);
    max-width: 100%;
    height: 95%;
    margin: 1.25%;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 600px) {
      margin: 0;
      height: 100%;
      width: 100%;
      border-radius: 0;
    }
  }
  .wait-players {
    overflow-x: auto;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 4px;
    div {
      flex: 0 0 auto;
      border-radius: 6px;
      margin: 1px;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      padding: 3px 6px;
      div {
        padding: 1px 4px;
      }
    }
  }
  .wait-action, .wait-slot {
    display: inline-flex;
    flex: 0 0 auto;
    margin: 4px;
  }
  .wait-slot {
    font-size: 2em;
  }
  .self, .owner {
    color: var(--clr-contrast)!important;
  }
  .self {
    font-weight: bolder;
  }
}
</style>
<script lang="ts" setup>
import { playerSetup } from 'store/player';
import { slot } from 'store/lobby/state';
import { useI18n } from 'vue-i18n';
import { sendStart } from 'store/ws/packetSender/vanilla/start';
import { CopyToClipboard } from 'store/utils/CopyToClipboard';

const { t } = useI18n({ useScope: 'global' });

const {
  players,
  selfId,
  ownerId,
  owner,
  isOwner
} = playerSetup();

const invite = () => CopyToClipboard(window.location.href);

</script>
