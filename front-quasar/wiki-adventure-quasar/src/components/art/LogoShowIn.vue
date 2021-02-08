<template>
  <div id="logoShowInContainer" class="logo-show-in">
    <div id="logoShowInDepthAdjust">
      <div id="logoShowInLogo">
        <img src="svg/logoV1.svg" alt="wikipedia logo"/>
      </div>
    </div>
    <img id="logoShowInTitle" src="svg/title.svg" alt="wikipedia adventure"/>
    <!--<div id="logoShowInTitle"><p>{{ title }}</p></div>-->
  </div>
</template>
<style lang="scss">
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
    top: 2em;
    width: 75vmin;
    transform: scale3d(1,1,1);
    animation: 6s ease-out 0.31s logoShowInBlurFadeIn;
    
  }

  @keyframes logoShowInBlurFadeIn {
    0% {
      opacity: 0.001;
      transform: scale3d(1,1,1);
    }
    12% {
      opacity: 0.001;
      transform: scale3d(3,3,1);
    }
    17% {
    }
    20% {
      opacity: 1;
      transform: scale3d(1,1,1);
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