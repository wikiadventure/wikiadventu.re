<template>
  <div class="error-404">
    <h1>
      404
    </h1>

    <main>
      {{ t('error404.content') }}
    </main>

    <q-btn class="action-btn" size="xl" push to="/" :label="t('error404.button')" no-caps />
  </div>
</template>
<style lang="scss">
.error-404 {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  place-items: center;
  justify-content: space-evenly;
  background: var(--clr-main);
  h1 {
    font-size: 8em;
    font-weight: 700;
  }
  main {
    opacity: 0.6;
    font-size: 1.5em;
  }
}

</style>
<script lang="ts">
/**
 * @todo Make a custom error page 
 * @body The error page should follow the design of the connection page
 */
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Error404',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return {
      t
    }
  }
});
</script>
