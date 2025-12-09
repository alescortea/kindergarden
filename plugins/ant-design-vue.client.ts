import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

export default defineNuxtPlugin({
  name: 'ant-design-vue',
  enforce: 'pre', // Load before other plugins
  setup(nuxtApp) {
    // Register Ant Design Vue globally
    nuxtApp.vueApp.use(Antd)
    
    // Verify components are registered
    if (import.meta.client) {
      console.log('Ant Design Vue plugin loaded')
      console.log('Available components:', Object.keys(nuxtApp.vueApp._context.components || {}).filter(k => k.startsWith('a-')))
    }
  }
})

