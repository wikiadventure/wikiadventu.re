<script setup lang="ts">
import ThemePicker from '../components/ThemePicker.vue';
import { connect, password, room_name, username } from '../stores/form';
import { twitchChatRead, twitchChatReadEdit, openTwitchOauth } from '../composables/useTwitch';
import LogoShowIn from "../components/art/LogoShowIn.vue";
import MdiTwitch from '~icons/mdi/twitch';
import { onMounted } from 'vue';
import DiceIcon from '~icons/mdi/dice-3'
import { getEnglishRandomUsername } from '../stores/randomUsername/randomUsername';
import GameButton from '../components/game/GameButton.vue';
import GithubIcon from '~icons/mdi/github';
import KofiIcon from '~icons/simple-icons/kofi';

onMounted(()=>{
  const current_url = new URL(window.location.toString());
  if (current_url.hash) {
    const params = new URLSearchParams(current_url.hash.slice(1));
    const room = params.get("room");
    if (room != null) room_name.value = room;
  }
})


function randomizeUsername(e:Event) {
  e.preventDefault();
  username.value = getEnglishRandomUsername();
}

</script>

<template>
  
<main class="game-form">
  <ThemePicker/>
  <LogoShowIn/>
  <form>
    <label class="username">
      <span>username</span>
      <input type="text" v-model="username" name="username">
      <button @click="randomizeUsername"><DiceIcon/></button>
    </label>
    <label>
      <span>room name</span>
      <input type="text" v-model="room_name"  name="room-name">
    </label>
    <label>
      <span>password</span>
      <input type="password" v-model="password" name="password">
    </label>
    <button :onclick="connect">Connect</button>
    <a class="twitch-button" :href="twitchChatRead" @click.prevent="openTwitchOauth(twitchChatRead)">
      Connect with Twitch (Read-only) <MdiTwitch/>
    </a>
    <a class="twitch-button" :href="twitchChatReadEdit" @click.prevent="openTwitchOauth(twitchChatReadEdit)">
      Connect with Twitch (Allow sending message in chat) <MdiTwitch/>
    </a>
  </form>
  <div class="button-container">
    <GameButton class="github-button" tag="a" href="https://github.com/wikiadventure/wikiadventu.re" target="_blank">Github <GithubIcon/></GameButton>
    <GameButton class="ko-fi-button" tag="a" href="https://ko-fi.com/sacramentix" target="_blank">Support me on Ko-fi <KofiIcon/></GameButton>
  </div>
</main>

</template>
<style>
.game-form {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  > form > .username {
    display: grid;
    column-gap: 1ch;
    grid-template-areas: 
      "s s"
      "i b";
    grid-template-columns: 1fr min-content;
    > span {
      grid-area: s;
    }
    > input {
      grid-area: i;
    }
    > button {
      grid-area: b;
      width: min-content;
      margin: 0;
      aspect-ratio: 1;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--front-color);
      
      > svg {
        height: 100%;
        width: auto;
        aspect-ratio: 1;
        transition: all ease-in-out .2s;
      }
      &:hover > svg {
        transform: rotate(180deg) scale(1.2);
      }
      &:active > svg {
        transform: rotate(-360deg) scale(1);
      }
    }
  }

  > .logo-show-in {
    max-width: 500px;
    z-index: -1;
  }
  > .theme-picker.select {
    position: absolute;
    top: 15px;
    right: 20px;
  }
  > form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    > label {
      display: flex;
      flex-direction: column;
    }
    input {
      padding: 5px 1ch;
      border-radius: 10px;
      border: 1px solid var(--front-color);
    }
    > button, > .twitch-button  {
      cursor: pointer;
      border-radius: 15px;
      padding: 15px 30px;
      text-align: center;
      font-size: 1.3em;
      text-decoration: none;
      background: var(--front-color);
      color: var(--back-color);
      
      > svg {
        font-size: 1.4em;
        vertical-align: middle;
      }
    }
    > .twitch-button {
      background: #6441a5;
      color: #eee;
    }
  }
  .button-container {
    margin-top: 35px;
    padding: 1ch;
    display: flex;
    gap: 1ch;
    .github-button {
      text-decoration: none;
      --game-button-color1: #fff;
      --game-button-color2: #111;
      --game-button-color3: #000;
      --game-button-color4: #050505;
    }
    .ko-fi-button {
      text-decoration: none;
      --game-button-color1: #fff;
      --game-button-color2: #4794ac;
      --game-button-color3: #5bc0de;
      --game-button-color4: #2e6f83;
      svg {
        color: #ff5f5f;
      }
    }
  }

}
</style>
