import { createApp } from 'vue'
import App from './App.vue'

import './assets/styles/variables.css'
import './assets/styles/glass.css'
import './assets/styles/animations.css'

// reveal CSS only hides after JS boot
document.documentElement.classList.add('js')

createApp(App).mount('#app')
