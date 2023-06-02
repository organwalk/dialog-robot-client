import { createRouter, createWebHistory } from 'vue-router'
import routes from "./router"

const router =createRouter({
    history:createWebHistory(),
    routes
})

//beforeEach
router.beforeEach((to, from, next) => {
    if (!sessionStorage.getItem('accessToken')) {
        if (to.name === "auth"){
            next()
        }else {
            window.location.href = "/auth"
        }
    } else {
        next()
    }
})


export default router