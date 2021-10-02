<template>
  <q-form class="connect-form">
    <div class="inputGrid">
      <div class="formTitle"><h3>{{ title }}</h3></div>
      <slot></slot>
    </div>
    <div class="buttonContainer"><slot name="button"></slot></div>
  </q-form>
</template>
<style lang="scss">
.connect-form {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.inputGrid {
  flex: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: min-content;
  gap: 5px 20px;
  padding: 0 20px;
  justify-content: space-evenly;
  @media(max-width: $breakpoint-xs-max) {
    > * {
      grid-column: span 2;
    }
  }
}
.formTitle {
  grid-column: span 2;
  text-align: center;
  @media(max-width: $breakpoint-xs-max) {
    h3 {
      margin: 20px 0;
      font-size: 2.5em;
    }
  }
}
.buttonContainer {
  flex: 1;
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
  align-items: center;
  justify-content: space-evenly;

}
</style>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ConnectForm',
  props: {
    title:String
  }
});
</script>