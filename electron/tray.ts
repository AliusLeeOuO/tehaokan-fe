import { app, Menu, Tray } from "electron"
import * as path from "path"

// 定义 mainWindow 和 appTray 的类型
let mainWindow: Electron.BrowserWindow | null = null
let appTray: Electron.Tray | null = null

// 隐藏主窗口，并创建托盘的函数
export function setTray(): void {
  const trayMenuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: "退出",
      click: (): void => {
        app.quit()
      }
    }
  ]

  // 创建托盘实例
  const iconPath = path.join(process.env.VITE_PUBLIC, "app-logo.png")
  appTray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)

  // 设置托盘悬浮提示
  appTray.setToolTip("notePad")
  // 设置托盘菜单
  appTray.setContextMenu(contextMenu)

  // 单击托盘小图标显示或隐藏应用
  appTray.on("click", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    }
  })
}

// 导出一个函数，用于设置 mainWindow 的引用
export default function(main: Electron.BrowserWindow): void {
  mainWindow = main
  // 应用启动时创建托盘图标
  setTray()
}
