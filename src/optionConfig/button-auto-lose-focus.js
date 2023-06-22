/**
 * ----- 此处无需维护 -----
 * 此处创建一个了自定义一指令，在main中引入定义为v-btn
 * 可以在任意el-button按钮中使用该指令
 * 解决按钮点击后无法自动失焦的问题，提高用户体验
 * by organWalk 2023.06.22
 */
export default {
    install: (app) => {
        const fun = function (evt) {
            let target = evt.target
            if (target.nodeName == 'SPAN') {
                target = evt.target.parentNode
            }
            target.blur()
        }
        app.directive('btn', {
            mounted(el) {
                el.addEventListener('focus', fun)
            },
            unmounted(el) {
                el.removeEventListener('focus', fun)
            }
        })
    }
}