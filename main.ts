
import { createApp } from 'vue'
import App from './App.vue'
import router from './src/router/index'
import { createPinia } from 'pinia'

import "./src/assets/theme.css"
import "./input.css"
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)


app.mount('#app')