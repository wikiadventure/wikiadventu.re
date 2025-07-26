import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import browserslist from 'browserslist';
import {browserslistToTargets} from 'lightningcss';
import Icons from 'unplugin-icons/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Icons({
      autoInstall: true,
    }),
  ],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%'))
    }
  },
  build: {
    cssMinify: 'lightningcss'
  }
})
