import { createApp } from 'vue'
import App from './App.vue'

// 全局样式（顺序重要：变量 → 玻璃效果 → 动画）
import './assets/styles/variables.css'
import './assets/styles/glass.css'
import './assets/styles/animations.css'

const app = createApp(App)
app.mount('#app')
