import { createApp } from 'vue'
import App from './App.vue'

import './assets/styles/variables.css'
import './assets/styles/glass.css'
import './assets/styles/animations.css'

// reveal CSS only hides after JS boot
document.documentElement.classList.add('js')

// importing useAppearance applies the stored appearance before mount (no FOUC);
// boot() runs again in App.vue setup (guarded by `booted`)
createApp(App).mount('#app')
