import { createApp } from 'vue'
import App from './App.vue'

import './assets/styles/variables.css'
import './assets/styles/glass.css'
import './assets/styles/animations.css'
import { useTheme } from './composables/useTheme'

// reveal CSS only hides after JS boot
document.documentElement.classList.add('js')

// boot theme before mount to avoid flash
useTheme()

createApp(App).mount('#app')
