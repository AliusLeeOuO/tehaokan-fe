import { app, BrowserWindow, ipcMain } from "electron"
import path from "node:path"
import { dropHistory, getSqlite3, historyCount, insertIntoHistory, queryHistory } from "./better-sqlite3"
import tray from "./tray.ts"

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist")
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, "../public")


let win: BrowserWindow | null

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"]

function createWindow() {
  win = new BrowserWindow({
    frame: false, // 隐藏窗口边框和控制按钮
    width: 1200, // 初始宽度
    height: 750, // 初始高度
    minWidth: 1200, // 最小宽度
    minHeight: 600, // 最小高度
    icon: path.join(process.env.VITE_PUBLIC, "app-logo.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true
    }
  })
  win.webContents.openDevTools({ mode: "detach" })

  // 添加主窗口关闭事件监听
  win.on("close", () => {
    // 当主窗口尝试关闭时，退出整个应用
    app.quit()
  })

  win.setMenu(null) // 隐藏菜单栏

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"))
  }

  // 直接调用暴露出的tray函数
  tray(win)
  win.on("closed", () => {
    win = null
  })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
    win = null
  }
})

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 最小化窗口
ipcMain.on("minimize-window", () => {
  if (win) win.minimize()
})

// 最大化或还原窗口
ipcMain.on("maximize-window", () => {
  if (win) {
    if (win.isMaximized()) {
      win.restore()
    } else {
      win.maximize()
    }
  }
})

// 关闭窗口
ipcMain.on("close-window", () => {
  if (win) {
    win.close()
  }
})

// 最小化到托盘
ipcMain.on("minimize-to-tray", () => {
  if (win) {
    win.hide()
  }
})

// 监听渲染进程发来的消息来打开新窗口
ipcMain.on("open-player-window", (_event, arg) => {
  const { type, resourceId } = arg // 从 arg 中解构出新参数

  let playerWindowURL
  if (VITE_DEV_SERVER_URL) {
    // 开发环境：使用Vite开发服务器的URL，并附加路由路径
    playerWindowURL = `${VITE_DEV_SERVER_URL}#/player`
  } else {
    // 生产环境
    playerWindowURL = `file://${path.join(process.env.DIST, "index.html")}`
  }

  const secondWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 800,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: false,
      // 添加 additionalArguments 传递自定义数据
      additionalArguments: [`type=${type}`, `resourceId=${resourceId}`]
    },
    ...arg.options
  })

  secondWindow.loadURL(playerWindowURL)
})

// 数据库操作

ipcMain.on("insert-history", (_event, resourceType, resourceId) => {
  insertIntoHistory(resourceType, resourceId)
})

ipcMain.on("query-history", (event) => {
  const historyData = queryHistory()
  event.reply("query-history-reply", historyData)
})

ipcMain.on("get-history-count", (event) => {
  const count = historyCount()
  event.reply("get-history-count-reply", count)
})

ipcMain.on("drop-history-data", (event) => {
  const result = dropHistory() // 调用函数删除所有历史记录
  if (result) {
    event.reply("drop-history-data-reply", "Success")
    return
  }
  event.reply("drop-history-data-reply", "Failed")
})


app.whenReady().then(() => {
  createWindow()
  const db = getSqlite3()
  win?.webContents.send("main-process-message", `[better-sqlite3] ${JSON.stringify(db.pragma("journal_mode = WAL"))}`)
})
