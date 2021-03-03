import { register } from 'register-service-worker'
import { Notify } from "quasar";
// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready (/* registration */) {
    console.log('Service worker is active.')
  },

  registered (/* registration */) {
    console.log('Service worker has been registered.')
  },

  cached (/* registration */) {
    console.log('Content has been cached for offline use.')
  },

  updatefound (/* registration */) {
    console.log('New content is downloading.')
  },

  updated (/* registration */) {
    console.log('New content is available; please refresh.')
  },

  offline () {
    Notify.create({
      type: 'error',
      position: 'top',
      message: "You are offline, the game don't work without connection!"
    });
  },

  error (/* err */) {
    console.error('Error during service worker registration:', err)
  }
})
