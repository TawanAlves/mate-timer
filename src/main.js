import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)

app.use(router)

app.mount('#app')
registerSW({
  onRegisteredSW(swRegistration) {
    swRegistration &&
      setInterval(
        () => {
          swRegistration.update()
        },
        60 * 60 * 1000,
      )
  },
})
