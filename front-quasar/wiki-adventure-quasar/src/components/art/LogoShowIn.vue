<template>
  <div id="logoShowInContainer" class="logo-show-in">
    <div id="logoShowInDepthAdjust">
      <div id="logoShowInLogo">
        <img src="svg/logoV1.svg" alt="wikipedia logo"/>
      </div>
    </div>
    <div id="logoShowInTitle"><p>{{ title }}</p></div>
  </div>
</template>
<style>
#logoShowInContainer {
  display: flex;
  width: 100%;
  height: calc(75vmin + 2em);
  justify-content: center;
  perspective: 500px;
  transform: translate3d(0px, 0px, 0px);
  opacity: 0;
  animation: 0.3105s steps(1, end) forwards logoShowInVisible;
}
@keyframes logoShowInVisible {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

  #logoShowInDepthAdjust {
    transform-style: preserve-3d;
    animation: 6s linear 0.31s logoShowInShowUp;
    transform: translate3d(0px, 0px, 0px);/*To enable GPU acceleration */
    padding-top: 2em;
    position: absolute;
  }
  #logoShowInLogo {
    transform: translate3d(0px, 0px, 0px);
    animation: 6s linear 0.31s logoShowInFirstSpin;
    will-change: transform;
  }
  #logoShowInLogo img {
    transform: translate3d(0px, 0px, 0px);
    filter: drop-shadow(0 0 25px rgba(18, 230, 238, 0.54));
    width: 75vmin;
    height: auto;
  }
  #logoShowInTitle {
    will-change: transform;
    position: absolute;
    /*background: rgba(255, 0, 0, 0.1);*/
    text-align: center;
    color: #cce7f8;
    margin-top: .5em;
    font-size: 7vw;
    transform: translate3d(0px, 0px, 0px);
    animation: 6s ease-out 0.31s logoShowInBlurFadeIn;
    text-shadow: 0 0 6px rgba(182, 211, 207, 0.9),
        0 0 30px rgba(182, 211, 207, 0.3), 0 0 12px rgba(15, 115, 223, 0.5),
        0 0 21px rgba(15, 115, 223, 0.9), 0 0 34px rgba(15, 115, 223, 0.8),
        0 0 54px rgba(15, 115, 223, 0.9);
    
  }
  #logoShowInTitle p {
    /*animation: 6s ease-out infinite neon;*/
  }

  @keyframes logoShowInBlurFadeIn {
    0% {
      opacity: 0;
      transform: scale(3);
    }
    12% {
      opacity: 0;
      transform: scale(3);
    }
    17% {
    }
    20% {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes logoShowInSpin {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
  @keyframes logoShowInFirstSpin {
    0%,5.01%,10.01%,15.01%,57.51%{
      transform: rotateY(0deg);
    }
    25% {
      transform: rotateY(180deg);
    }
    5%,10%,15%,57.5% {
      transform: rotateY(360deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }

  @keyframes logoShowInShowUp {
    0%{
      transform: translate3d(-1500px, 1500px, -1500px);
    }
    10% {
      transform: translate3d(-300px, 300px, -1200px);
    }
    15%, 100% {
      transform: translate3d(0px, 0px, 0px);
    }

  }
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'LogoShowIn',
  components: {  },
  props: {
    title: String
  },
  mounted() {
    var logo = document.getElementById("logoShowInLogo");
    logo.addEventListener('animationend', () => {
      logo.style.animation = "6s linear infinite logoShowInSpin";   
    });
  }

});
</script>