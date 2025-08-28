import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// Register service worker (vite-plugin-pwa)
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

createApp(App).mount('#app')
