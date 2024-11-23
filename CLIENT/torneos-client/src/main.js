import { createApp } from 'vue'
import { createPinia } from 'pinia'  // Asegúrate de importar createPinia
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())  // Inicializa Pinia
app.use(router)  // Usa el router si es necesario
app.mount('#app')


