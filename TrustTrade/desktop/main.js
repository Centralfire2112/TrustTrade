const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')

app.setName('TrustTrade')
if (process.platform === 'win32') app.setAppUserModelId('com.trusttrade.app')

const ICON = path.join(
  __dirname, 'build',
  process.platform === 'win32' ? 'icon.ico' : 'icon.png'
)

// In dev: __dirname = TrustTrade/desktop/
// In packaged app: files are copied into process.resourcesPath/client/dist/
function getIndexPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'client', 'dist', 'index.html')
  }
  return path.join(__dirname, '..', 'client', 'dist', 'index.html')
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 780,
    minWidth: 820,
    minHeight: 560,
    backgroundColor: '#0A0A0A',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    title: 'TrustTrade',
    icon: ICON,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  })

  win.once('ready-to-show', () => { win.show(); win.focus() })

  // Log load failures so we can diagnose quickly
  win.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error(`Load failed [${code}] ${desc} — ${url}`)
    // Show the window anyway so the user isn't staring at nothing
    if (!win.isVisible()) win.show()
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  win.loadFile(getIndexPath())
  Menu.setApplicationMenu(buildMenu(win))
}

function buildMenu(win) {
  const template = [
    ...(process.platform === 'darwin' ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'hide' }, { role: 'hideOthers' }, { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    }] : []),
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        ...(process.platform === 'darwin'
          ? [{ type: 'separator' }, { role: 'front' }]
          : [{ role: 'close' }]),
      ],
    },
  ]
  return Menu.buildFromTemplate(template)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
