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
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    error404: 
      content: "Hey! How did you get here? There is nothing to see. You should return home."
      button: "Home"
  fr:
    error 404: 
      content: "Hey! Comment est vous arrivé là? Il n'y a rien à voir. Vous devriez retourner à l'accueil."
      button: "Accueil"
</i18n>
