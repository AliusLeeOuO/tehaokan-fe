import { ipcMain } from "electron"
import {
  deleteFavourite,
  dropHistory,
  historyCount,
  insertIntoFavourite,
  insertIntoHistory,
  queryFavourite,
  queryHistory,
  queryWatching,
  deleteWatching,
  dropWatching,
  queryWatchingItem,
  insertIntoWatching
} from "./better-sqlite3.ts"
import { resourceType } from "../db-types.ts"
import IpcMainEvent = Electron.IpcMainEvent

// 数据库操作
export default function initDbIpc() {
  ipcMain.on("insert-history", (_event: IpcMainEvent, resourceType: resourceType, resourceId: number) => {
    insertIntoHistory(resourceType, resourceId)
  })

  ipcMain.on("query-history", (event: IpcMainEvent) => {
    const historyData = queryHistory()
    event.reply("query-history-reply", historyData)
  })

  ipcMain.on("get-history-count", (event: IpcMainEvent) => {
    const count = historyCount()
    event.reply("get-history-count-reply", count)
  })

  ipcMain.on("drop-history-data", (event: IpcMainEvent) => {
    const result = dropHistory() // 调用函数删除所有历史记录
    if (result) {
      event.reply("drop-history-data-reply", "Success")
      return
    }
    event.reply("drop-history-data-reply", "Failed")
  })

  // 收藏操作
  ipcMain.on("insert-favourite", (_event: IpcMainEvent, resourceType: resourceType, resourceId: number) => {
    insertIntoFavourite(resourceType, resourceId)
  })

  // 删除收藏记录
  ipcMain.on("delete-favourite", (_event: IpcMainEvent, resourceType: resourceType, resourceId: number) => {
    // 删除收藏记录
    deleteFavourite(resourceType, resourceId)
  })

  // 查询收藏记录
  ipcMain.on("query-favourite", (event: IpcMainEvent, resourceType: resourceType) => {
    const favouriteData = queryFavourite(resourceType)
    event.reply("query-favourite-reply", favouriteData)
  })

  // 查询追剧记录
  ipcMain.on("query-follow", (event: IpcMainEvent) => {
    const followData = queryWatching()
    event.reply("query-follow-reply", followData)
  })

  // 添加追剧记录
  ipcMain.on("insert-watching", (_event: IpcMainEvent, resourceId: number) => {
    insertIntoWatching(resourceId)
  })


  // 删除追剧记录
  ipcMain.on("delete-watching", (_event: IpcMainEvent, resourceId: number) => {
    // 删除追剧记录
    deleteWatching(resourceId)
  })

  // 删除所有追剧记录
  ipcMain.on("drop-watching-data", (event: IpcMainEvent) => {
    const result = dropWatching() // 调用函数删除所有追剧记录
    if (result) {
      event.reply("drop-watching-data-reply", "Success")
      return
    }
    event.reply("drop-watching-data-reply", "Failed")
  })

  // 发送更新追剧记录
  ipcMain.on("update-follow", (event: IpcMainEvent) => {
    // 发送更新追剧记录，使用IPC通信发送消息
    event.reply("update-follow-reply", true)
  })

  // 查询单条追剧记录
  ipcMain.on("query-watching-single", (event: IpcMainEvent, resourceId: number) => {
    const followData = queryWatchingItem(resourceId)
    event.reply("query-watching-single-reply", followData)
  })
}
