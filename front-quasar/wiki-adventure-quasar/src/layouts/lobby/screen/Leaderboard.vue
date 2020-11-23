<template>
  <div id="leaderboard">
    <div id="grid-leaderboard">
      <div class="grid-leaderboard-podium grid-leaderboard-2">
        <div id="position-2"><img src="svg/podium2neonV2.svg" alt="number 2"/></div>
        <div id="name-2">{{ playerByScore[1] ? playerByScore[1].name : "" }}</div>
        <div id="score-2">{{ playerByScore[1] ? playerByScore[1].score : "" }}</div>
      </div>
      <div class="grid-leaderboard-podium grid-leaderboard-1">
        <div id="position-1"><img src="svg/podium1neonV2.svg" alt="number 1"/></div>
        <div id="name-1">{{ playerByScore[0] ? playerByScore[0].name : "" }}</div>
        <div id="score-1">{{ playerByScore[0] ? playerByScore[0].score : "" }}</div>
      </div>
      <div class="grid-leaderboard-podium grid-leaderboard-3">
        <div id="position-3"><img src="svg/podium3neonV2.svg" alt="number 3"/></div>
        <div id="name-3">{{ playerByScore[1] ? playerByScore[1].name : "" }}</div>
        <div id="score-3">{{ playerByScore[1] ? playerByScore[1].score : "" }}</div>
      </div>
      <div class="grid-leaderboard-item" v-for="(p, i) in playerByScore.slice(3)" :key="p.id">
        <div class="position">{{ i+3 }}</div>
        <div class="name">{{ p.pseudo }}</div>
        <div class="score">{{ p.score }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
#leaderboard {
    line-height: 1.7em;
    color: rgb(220, 220, 220);
    background: #36393F;
    font-size: 13px;
    position: fixed;
    z-index: 5;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    opacity: 0;
    transition: opacity ease-in-out 0.5s;

    #grid-leaderboard {
        display: grid;
        gap: 10px;
        grid-template-columns: 1.4fr 2fr 1.4fr;
        grid-auto-rows: minmax(2em, auto);
    }

    .grid-leaderboard-podium {
        border-radius: 5px;
        display: flex;
        height: 28vw;
        flex-direction: column;
        align-items: center;
        
    }

    .grid-leaderboard-1 {
        background-color: rgba(218, 165, 32, 0.5);
    }

    .grid-leaderboard-2 {
        background-color: rgba(192, 192, 192, 0.5);
    }
    .grid-leaderboard-3 {
        background-color: rgba(205, 128, 50, 0.5);
    }

    .grid-leaderboard-item {
        border-radius: 5px;
        grid-column: 1 / -1;
        background-color: #40444B;
        display: flex;
        flex-direction: row;
        max-width: 100%;
        padding: 2px;
    }


    .position {
        flex: 0 0 25px;
        text-align: center;
        color: #29a19c;
        /*background-color: rgba(50, 250, 50, 0.3);*/
        border-right: rgba(41, 161, 156, 0.7) ridge 2px;
    }
    #name-1, #score-1 {
        color: hsl(43, 74%, 49%);
        text-shadow: 
        0 0.025em 0 hsl(43, 74%, 44%), 
        0 0.05em 0 hsl(43, 74%, 39%), 
        0 0.075em 0 hsl(43, 74%, 34%), 
        0 0.1em 0 hsl(43, 74%, 29%), 
        0 0.125em 0 hsl(43, 74%, 24%), 
        0 0.06em 0.01em rgba(0,0,0,.1), 
        0 0 0.05em rgba(0,0,0,.1), 
        0 0.01em 0.03em rgba(0,0,0,.3), 
        0 0.03em 0.05em rgba(0,0,0,.2), 
        0 0.05em 0.1em rgba(0,0,0,.25), 
        0 0.1em 0.1em rgba(0,0,0,.2), 
        0 0.2em 0.2em rgba(0,0,0,.15);
    }
    #name-2, #score-2 {
        color: silver;
        text-shadow: 
        0 0.025em 0 hsl(0, 0%, 70%), 
        0 0.05em 0 hsl(0, 0%, 65%), 
        0 0.075em 0 hsl(0, 0%, 60%), 
        0 0.1em 0 hsl(0, 0%, 55%), 
        0 0.125em 0 hsl(0, 0%, 50%), 
        0 0.06em 0.01em rgba(0,0,0,.1), 
        0 0 0.05em rgba(0,0,0,.1), 
        0 0.01em 0.03em rgba(0,0,0,.3), 
        0 0.03em 0.05em rgba(0,0,0,.2), 
        0 0.05em 0.1em rgba(0,0,0,.25), 
        0 0.1em 0.1em rgba(0,0,0,.2), 
        0 0.2em 0.2em rgba(0,0,0,.15);
    }
    #name-3, #score-3 {
        color: #cd8032;
        text-shadow: 
        0 0.025em 0 hsl(30, 61%, 35%), 
        0 0.05em 0 hsl(30, 61%, 30%), 
        0 0.075em 0 hsl(30, 61%, 25%), 
        0 0.1em 0 hsl(30, 61%, 20%), 
        0 0.125em 0 hsl(30, 61%, 15%), 
        0 0.06em 0.01em rgba(0,0,0,.1), 
        0 0 0.05em rgba(0,0,0,.1), 
        0 0.01em 0.03em rgba(0,0,0,.3), 
        0 0.03em 0.05em rgba(0,0,0,.2), 
        0 0.05em 0.1em rgba(0,0,0,.25), 
        0 0.1em 0.1em rgba(0,0,0,.2), 
        0 0.2em 0.2em rgba(0,0,0,.15);
    }


    #position-1, #position-2, #position-3 {
        height: calc(28vw - 4em);
        width: calc(28vw - 4em);
        padding: 0;
        /*background-color: rgba(255, 0, 0, 0.3);*/
        border-radius: 50%;
    }


    #name-1, #name-2, #name-3 {
        flex: 0 0 2em;
        max-width: 25.2vw;
        font-weight: bolder;
        text-align: center;
        /*background-color: rgba(38, 255, 0, 0.3);*/
        overflow: hidden;
        white-space: pre;
        text-overflow: ellipsis;
    }

    #score-1, #score-2, #score-3 {
        flex: 0 0 2em;
        max-width: 25.2vw;
        font-size: 1.2em;
        font-weight: bolder;
        text-align: center;
        /*background-color: rgba(98, 0, 255, 0.3);*/
        overflow: hidden;
        white-space: pre;
        text-overflow: ellipsis;
    }

    .name {
        padding: 0 10px;
        flex: 1 1 0;
        text-align: center;
        /*background-color: rgba(250, 50, 50, 0.3);*/
        overflow: hidden;
        white-space: pre;
        text-overflow: ellipsis;
        border-right: rgba(41, 161, 156, 0.7) ridge 2px;
    }

    .score {
        padding: 0 10px;
        flex: 1 1 0;
        text-align: right;
        color: #29a19c;
        /*background-color: rgba(50, 50, 250, 0.3);*/
        overflow: hidden;
        white-space: pre;
        text-overflow: ellipsis;

    }
}
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Player } from '../../../store/gameData/state';

export default defineComponent({
  name: 'Leaderboard',
  computed: {
    playerByScore():Player[] {
      var players = this.$store.state.gameData.players as Player[];
      return players.sort((a:Player, b:Player) => {return a.score - b.score});
    }
  }
});
</script>
