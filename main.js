const {app, BrowserWindow} = require('electron')
const remote = require("@electron/remote/main")
remote.initialize()

function createWindow() {
    var mainWindow = new BrowserWindow({
        transparent:true,
        width:1400,
        height:860,
        frame:false,
        title:'Xeno-loader',
        icon:'public/favicon.ico',
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        }
    })
    // mainWindow.loadFile('index.html')
    // mainWindow.loadFile('dist/index.html')
    // mainWindow.setAspectRatio(12/6.5)
    mainWindow.loadURL('http://localhost:8080')
    mainWindow.on('close',()=>{
        mainWindow = null
    })
    remote.enable(mainWindow.webContents)
}
app.on('ready',()=>{
    createWindow()
})
