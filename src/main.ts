import { createApp } from 'vue'
import App from './App.vue'

// 全局样式（顺序重要：变量 → 玻璃效果 → 动画）
import './assets/styles/variables.css'
import './assets/styles/glass.css'
import './assets/styles/animations.css'

// boot style preset as early as possible (before mount paint)
try {
  const saved = localStorage.getItem('cyan-style-preset')
  if (saved === 'quiet' || saved === 'glass' || saved === 'max') {
    document.documentElement.dataset.style = saved
  } else {
    document.documentElement.dataset.style = 'quiet'
  }
} catch {
  document.documentElement.dataset.style = 'quiet'
}

const app = createApp(App)
app.mount('#app')
