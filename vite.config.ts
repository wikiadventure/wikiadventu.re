import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import Icons from 'unplugin-icons/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from "node:fs";
// import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Icons({
      autoInstall: true,
      compiler: "vue3"
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'Wiki Adventure multiplayer',
        short_name: 'WikiAdventure',
        description: 'Play on the web of wikipedia with your friend.',
        theme_color: '#000000',
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
    // basicSsl({domains: ["dev.wikiadventu.re"]})
  ],
  server: {
    host: 'dev.wikiadventu.re',
    port: 5882,
    strictPort: true,
    https: {
      key:  readFileSync('certs/dev.key'),
      cert: readFileSync('certs/dev.crt')
    }
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('last 2 versions'))
    }
  },
  build: {
    cssMinify: 'lightningcss'
  }
})
