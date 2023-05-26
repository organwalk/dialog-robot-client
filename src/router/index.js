import { createRouter, createWebHistory } from 'vue-router'
import routes from "./router"

const router =createRouter({
    history:createWebHistory(),
    routes
})

//beforeEach


export default router