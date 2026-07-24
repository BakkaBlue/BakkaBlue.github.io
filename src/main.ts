import { createApp } from 'vue'
import App from './App.vue'

import './assets/styles/variables.css'
import './assets/styles/glass.css'
import './assets/styles/animations.css'
import { useAppearance } from './composables/useAppearance'

// reveal CSS only hides after JS boot
document.documentElement.classList.add('js')

// boot multi-profile appearance before mount to avoid flash
useAppearance()

createApp(App).mount('#app')
