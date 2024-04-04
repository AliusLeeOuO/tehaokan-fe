import { ipcRenderer, contextBridge, ipcMain } from "electron"

// 解析通过 'additionalArguments' 传递的自定义数据
const parseCustomArgs = () => {
  const args = process.argv
  const customArgs: { [key: string]: string } = {}
  args.forEach(arg => {
    if (arg.includes("=")) {
      const [key, value] = arg.split("=")
      customArgs[key] = decodeURIComponent(value)
    }
  })
  return customArgs
}
const { type, resourceId } = parseCustomArgs()

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  // IPC 通信方法
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    ipcRenderer.invoke(channel, ...omit)
  },
  removeAllListeners(...args: Parameters<typeof ipcRenderer.removeAllListeners>) {
    const [channel] = args
    ipcRenderer.removeAllListeners(channel)
  },
  // You can expose other APTs you need here.
  // ...
  // 获取从主进程传递的数据
  getType: () => type,
  getResourceId: () => resourceId
})
