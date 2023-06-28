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
        console.log('!sessionStorage.getItem\'accessToken\'');
        if (to.name === "auth"){
            console.log('toname 等于 auth');
            next()
        }else {
            window.location.href = "/auth"
            console.log('toname 不等于 auth');
        }
    } else {
        if(to.path === '/'){
            window.location.href = "/chat"
        }
        console.log("啊这");
        next()
    }
})


export default router