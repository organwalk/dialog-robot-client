const remote = require('@electron/remote')

window.remote = remote;
addEventListener('DOMContentLoaded',()=>{
    //利用remote获取当前窗口对象
    let mainWin = remote.getCurrentWindow()
    window.currentWindow = mainWin
    const btns_window = document.getElementsByClassName('btn_circle')
    btns_window[0].addEventListener('click',()=>{
        console.log("关闭");
        mainWin.close()
    })
    btns_window[1].addEventListener('click',()=>{
        // console.log("最大化");
        if(!mainWin.isMaximized()) {
            // mainWin.setBackgroundColor('#FFF'); // 将窗口背景色设置为白色
            mainWin.maximize()
            console.log("最大化");
        } else {
            // mainWin.restore()//背景透明的时候无效
            console.log("最大化恢复");
            mainWin.unmaximize()
        }
    })
    btns_window[2].addEventListener('click',()=>{
        console.log("最小化");
        if(!mainWin.isMinimized()) {
            mainWin.minimize()

        } else {
            mainWin.restore()
        }
    })

    
    const box_btns = document.getElementById('btns-main-window')
    box_btns.addEventListener('mouseover',()=>{
        // console.log(box_btns.childNodes[0].style);
        box_btns.children[0].style['display'] = 'block'
    })
    box_btns.addEventListener('mouseout',()=>{
        // console.log(box_btns.childNodes[0]);
        box_btns.children[0].style['display'] = 'none'
    })
    var mainBtns = document.getElementsByClassName('btn_circle')
    mainBtns = Array.from(mainBtns)
    function allBtnUp() {
        mainBtns.forEach(btn_w => {
            btn_w.childNodes[0].style['display'] = 'inline-block'
        });
    }
    function allBtnDown() {
        mainBtns.forEach(btn_w => {
            btn_w.childNodes[0].style['display'] = 'none'
        });
    }
    mainBtns.forEach(btn_w => {
        btn_w.addEventListener('mouseover',()=>{
            // console.log("关");
            allBtnUp()
        })
        btn_w.addEventListener('mouseout',()=>{
            // console.log("开");
            allBtnDown()
        })
    });
})

