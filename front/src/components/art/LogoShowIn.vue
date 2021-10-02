<template>
  <div class="logo-show-in">
    <div class="zTransform">
      <div class="logo">
        <img src="svg/logoV1.svg" alt="wikipedia logo"/>
      </div>
    </div>
    <img v-if="title == null" class="title" src="svg/title.svg" alt="wikipedia adventure"/>
    <div v-else class="title"><p>{{ title }}</p></div>
  </div>
</template>
<style lang="scss">
.logo-show-in {
  display: flex;
  width: 100%;
  height: calc(75vmin + 2em);
  opacity: 0;
  justify-content: center;
  perspective: 75vmin;
  transform: translate3d(0px, 0px, 0px);
  animation: 0.8005s steps(1, end) forwards logo-visibility; // prevent logo beeing visible at start
  filter: drop-shadow(0 0 25px rgba(18, 230, 238, 0.54));

  .zTransform {
    position: absolute;
    padding-top: 2em;
    transform-style: preserve-3d;
    transform: translate3d(0px, 0px, 0px);/*To enable GPU acceleration */
    animation: 6s linear 0.8s logo-zTransform;

  }
  .logo {
    transform-style: preserve-3d;
    transform: translate3d(0px, 0px, 0px);
    animation: 6s linear 0.8s logo-spin infinite;
    will-change: transform;
    img {
      width: 75vmin;
      height: auto;
      transform: translate3d(0px, 0px, 0px);
      animation: 1.5s cubic-bezier(0, 1, 1, 1) 0.8s logo-fast-spin;
    }
  }
  
  .title {
    position: absolute;
    top: 2em;
    width: 75vmin;
    transform: scale3d(1,1,1);
    animation: 6s ease-out 0.8s logo-blur-fade-in;
    will-change: transform;
    
  }

  .title p {
    font-size: 7vw;
    text-align: center;
  }

}
@keyframes logo-visibility {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.body--dark {
  .logo-show-in .title p {
    color: #cce7f8;
    text-shadow: 0 0 6px rgba(182, 211, 207, 0.9),
      0 0 30px rgba(182, 211, 207, 0.3), 0 0 12px rgba(18, 230, 238, 0.5),
      0 0 21px rgba(18, 230, 238, 0.8), 0 0 34px rgba(18, 230, 238, 0.75),
      0 0 54px rgba(18, 230, 238, 0.8);
  }
}
.body--light {
  .logo-show-in .title p {
    color: #ebf7ff;
    text-shadow: 0 0 6px rgba(72, 84, 82, 0.9),
      0 0 30px rgba(182, 211, 207, 0.3), 0 0 12px rgba(18, 230, 238, 0.5),
      0 0 21px rgba(18, 230, 238, 0.8), 0 0 34px rgba(18, 230, 238, 0.75),
      0 0 54px rgba(18, 230, 238, 0.8);
  }
}
@keyframes logo-blur-fade-in {
  0% {
    //we don't start at 0 because browser make optimisation so they don't load the logo and it will pop of with unwanted delay
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
@keyframes logo-spin {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}
@keyframes logo-fast-spin {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(2160deg); }
}
@keyframes logo-zTransform {
  0% { transform: translate3d(-225vmin, 225vmin, -225vmin); }
  10% { transform: translate3d(-45vmin, 45vmin, -180vmin); }
  15%, 100% { transform: translate3d(0vmin, 0vmin, 0vmin); }
}
@media (prefers-reduced-motion: reduce) {
  .logo-show-in {
    animation: 0s forwards logo-visibility;
    .zTransform {
      animation: 0s logo-zTransform;
    }
    .logo {
      &,img {
        animation: none;
      }
    }
    .title {
      animation: 0s logo-blur-fade-in;
    }
  }
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LogoShowIn',
  props: {
    title: String
  }
});
</script>