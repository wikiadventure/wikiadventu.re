<template>
    <div class="connect-form">
      <h3 class="formTitle">{{ title }}</h3>
        <q-form>
          <div class="input-grid">
            <slot></slot>
          </div>
          <div class="row justify-evenly q-my-lg">
            <slot name="button"></slot>
          </div>
        </q-form>
      </div>
</template>
<style lang="scss">
.formTitle {
  text-align: center;
  @media(max-width: 720px) {
    margin: 2px;
    font-size: 2.5em;
  }
}
.input-grid {
  display: grid;
  grid-gap: 20px;
  padding: 20px;
  grid-template-columns: 1fr 1fr;
  justify-content: space-evenly;
  @media(max-width: $breakpoint-sm-max) {
    grid-template-columns: 1fr;
  }
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