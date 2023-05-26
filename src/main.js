import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router_index from '@/router/index'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(router_index)
app.mount('#app')
