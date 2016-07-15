const electron = require('electron')
const { app } = electron
const { BrowserWindow } = electron

// enable chrome dev-tools when builded
// require('electron-debug')({ enabled: true, showDevTools: true })

let win

const createWindow = () => {
  win = new BrowserWindow({ width: 800, height: 800 })
  win.loadURL(`file://${__dirname}/index.html`)
  win.on('closed', () => { win = null })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => (process.platform !== 'darnwin') && app.quit())
app.on('activate', () => (win === null) && createWindow())

const { resolve } = require('path')
const { execSync } = require('child_process')
execSync(`open -a xcode ${resolve(__dirname, 'xcode-project/pokemon-webspoof.xcodeproj')}`)
