import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router_index from '@/router/index'
import store from '@/store'
import btn from '@/optionConfig/button-auto-lose-focus'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(router_index)
app.use(store)
app.use(btn)
app.mount('#app')

/**
 * ----- 此处无需维护 -----
 * 用以解决ElementPlus循环渲染导致的BUG提示
 */
const debounce = (fn, delay) => {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
    constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
    }
}
