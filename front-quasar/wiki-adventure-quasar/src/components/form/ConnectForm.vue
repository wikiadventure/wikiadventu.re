<template>
    <div class="connect-form">
      <h3 class="formTitle">{{ title }}</h3>
        <q-form>
          <div class="row wrap">
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