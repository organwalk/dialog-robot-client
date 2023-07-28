import { createRouter, createWebHistory } from 'vue-router'
import routes from "./router"

const router =createRouter({
    history:createWebHistory(),
    // base: './',
    // base: "file://" + __dirname + "/",
    routes
})

//beforeEach
router.beforeEach((to, from, next) => {
    if (!sessionStorage.getItem('uid')) {
        if (to.name === "auth"){
            next()
        }else {
            window.location.href = "/auth"
        }
    } else {
        if(to.path === '/'){
            window.location.href = "/chat"
        }
        next()
    }
})


export default router