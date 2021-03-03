<template>
  <div>
    <audio id="winSound">
      <source src="sounds/win.ogg" type="audio/ogg">
      <source src="sounds/win.mp3" type="audio/mpeg">
    </audio>
    <audio id="loseSound">
      <source src="sounds/lose.ogg" type="audio/ogg">
      <source src="sounds/lose.mp3" type="audio/mpeg">
    </audio>
    <audio id="countDownSound">
      <source src="sounds/countDown.ogg" type="audio/ogg">
      <source src="sounds/countDown.mp3" type="audio/mpeg">
    </audio>
    <audio id="notifSound">
      <source src="sounds/notif.ogg" type="audio/ogg">
      <source src="sounds/notif.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Game',
  data(): {
    winAudio:HTMLAudioElement | null,
    loseAudio:HTMLAudioElement | null,
    countDownAudio:HTMLAudioElement | null,
    notifAudio:HTMLAudioElement | null,
    unsubscribeMutation:() => void
  } {
    return {
      winAudio: null,
      loseAudio: null,
      countDownAudio: null,
      notifAudio: null,
      unsubscribeMutation:() => {}
    }
  },
  mounted() {
    this.winAudio = document.getElementById("winSound") as HTMLAudioElement;
    this.loseAudio = document.getElementById("loseSound") as HTMLAudioElement;
    this.countDownAudio = document.getElementById("countDownSound") as HTMLAudioElement;
    this.notifAudio = document.getElementById("notifSound") as HTMLAudioElement;
    this.onVolume(this.$store.state.gameData.volume);
    this.onMute(this.$store.state.gameData.mute);
  },
  created() {
    var vm = this;
    vm.unsubscribeMutation = vm.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case "gameData/volume":
          return vm.onVolume(mutation.payload);
        case "gameData/mute":
          return vm.onMute(mutation.payload);
      }
    });
  },
  methods: {
    onVolume(payload:number) {
      this.winAudio.volume = payload;
      this.loseAudio.volume = payload;
      this.countDownAudio.volume = payload;
      this.notifAudio.volume = payload;
    },
    onMute(payload:boolean) {
      this.winAudio.muted = payload;
      this.loseAudio.muted = payload;
      this.countDownAudio.muted = payload;
      this.notifAudio.muted = payload;
    }
  },
  beforeDestroy() {
    this.unsubscribeMutation!();
  }
});
</script>