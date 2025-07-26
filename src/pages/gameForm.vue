<script setup lang="ts">
import { inGame, password, room_name, username } from '../stores/form';

function connect(e:Event) {
    e.preventDefault();
    inGame.value = true;
}
</script>

<template>
<form class="game-form">
  <label>username</label>
  <input type="text" v-model="username">
  <label>room name</label>
  <input type="text" v-model="room_name">
  <label>password</label>
  <input type="password" v-model="password">
  <button :onclick="connect">connect</button>
</form>
</template>
<style>
.game-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
