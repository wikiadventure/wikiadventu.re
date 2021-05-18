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
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.inputGrid {
  display: grid;
  gap: 5px 20px;
  flex: 0;
  padding: 0 20px;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: min-content;
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
      font-size: 2.5em;
      margin: 20px 0;
    }
  }
}
.buttonContainer {
  flex: 1;
  padding-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

}
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ConnectForm',
  props: {
    title:String
  }
});
</script>