import { ipcMain } from "electron"
import {
  deleteFavourite,
  dropHistory,
  historyCount,
  insertIntoFavourite,
  insertIntoHistory,
  queryFavourite,
  queryHistory
} from "./better-sqlite3.ts"
import { resourceType } from "../db-types.ts"

// 数据库操作
export default function initDbIpc() {
  ipcMain.on("insert-history", (_event, resourceType: resourceType, resourceId: number) => {
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

  // 收藏操作
  ipcMain.on("insert-favourite", (_event, resourceType: resourceType, resourceId: number) => {
    insertIntoFavourite(resourceType, resourceId)
  })

  // 删除收藏记录
  ipcMain.on("delete-favourite", (_event, resourceType: resourceType, resourceId: number) => {
    // 删除收藏记录
    deleteFavourite(resourceType, resourceId)
  })

  // 查询收藏记录
  ipcMain.on("query-favourite", (event, resourceType: resourceType) => {
    const favouriteData = queryFavourite(resourceType)
    event.reply("query-favourite-reply", favouriteData)
  })
}
