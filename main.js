const electron = require('electron')
const { resolve } = require('path')
const { execSync } = require('child_process')

const tryCatch = require('./src/try-catch')

const { app } = electron
const { BrowserWindow } = electron

// enable chrome dev-tools when builded
// require('electron-debug')({ enabled: true, showDevTools: true })

let win

const createWindow = () => {
  win = new BrowserWindow({ width: 800, height: 800 })
  win.loadURL(`file://${__dirname}/index.html`)

  // open external URLs into default browser
  win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    execSync(`open ${url}`)
  })

  win.on('closed', () => { win = null })
}

app.on('ready', () => {
  const tmp = require('tmp')

  tmp.dir((err, path) => {
    if (err) throw err

    global.tmpProjectPath = path
    createWindow()

    execSync(`cp -R ${resolve(__dirname, 'xcode-project')} ${resolve(path)}`)
    execSync(`open ${resolve(path, 'xcode-project/pokemon-webspoof.xcodeproj')}`)

    // quit xcode && remove tmp directory on exit
    app.on('before-quit', () => {
      tryCatch(() => execSync('killall Xcode'))
      tryCatch(() => execSync(`rm -rf ${path}`))
    })
  })
})

app.on('window-all-closed', () => (process.platform !== 'darwin') && app.quit())
app.on('activate', () => (win === null) && createWindow())
