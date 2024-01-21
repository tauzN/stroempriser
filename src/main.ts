import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { createRouter, createWebHistory } from 'vue-router'
import priser from '@/pages/priser.vue'
import Elbil from '@/pages/Elbil/Elbil.vue'
import dayjs from 'dayjs'
import da from 'dayjs/locale/da'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: priser
        },
        {
            path: "/elbil",
            component: Elbil
        }
    ]
})

const app = createApp(App)
dayjs.locale(da)
app.use(router)
app.mount('#app')
