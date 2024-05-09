import { app } from "electron"
import path from "node:path"
import Database from "better-sqlite3"
import { type FavouriteItem, type HistoryItem, type resourceType, type WatchingItem } from "../db-types.ts"

const root = path.join(__dirname, "..")
// const TAG = "[better-sqlite3]"
let database: Database.Database

function initializeDatabase(database: Database.Database): void {
  // 创建历史记录表
  const createHistoryTableSQL = `
      CREATE TABLE IF NOT EXISTS history
      (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          resource_type TEXT NOT NULL,
          resource_id INTEGER NOT NULL,
          gmt_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `
  database.prepare(createHistoryTableSQL).run()

  // 创建收藏记录表
  const createFavouriteTableSQL = `
      CREATE TABLE IF NOT EXISTS favourite
      (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          resource_type TEXT NOT NULL,
          resource_id INTEGER NOT NULL,
          gmt_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `
  database.prepare(createFavouriteTableSQL).run()

  // 创建追剧记录表
  const createWatchingTableSQL = `
      CREATE TABLE IF NOT EXISTS watching
      (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          resource_id INTEGER NOT NULL,
          gmt_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `
  database.prepare(createWatchingTableSQL).run()
}

export function insertIntoHistory(resourceType: resourceType, resourceId: number) {
  // 先查询是否已存在，如果存在则将原有记录更改时间为当前时间
  const selectSQL = `
      SELECT COUNT(*) AS count
      FROM history
      WHERE resource_type = ?
        AND resource_id = ?;
  `
  const count = (database.prepare(selectSQL).get(resourceType, resourceId) as { count: number }).count
  if (count > 0) {
    const updateSQL = `
        UPDATE history
        SET gmt_create = CURRENT_TIMESTAMP
        WHERE resource_type = ?
          AND resource_id = ?;
    `
    database.prepare(updateSQL).run(resourceType, resourceId)
    return
  }

  const insertSQL = `
      INSERT INTO history (resource_type, resource_id)
      VALUES (?, ?);
  `
  database.prepare(insertSQL).run(resourceType, resourceId)
}

// 查询历史记录
export function queryHistory(): HistoryItem[] {
  const selectSQL = `
      SELECT id, resource_type, resource_id, gmt_create
      FROM history
      ORDER BY gmt_create DESC;
  `
  // 使用typescript断言
  return database.prepare(selectSQL).all() as HistoryItem[]
}

// 查询历史记录数量
export function historyCount(): number {
  const selectSQL = `
      select COUNT(*) as count
      from history
  `
  const stmt = database.prepare(selectSQL)
  const result = stmt.get() as { count: number } // 执行 SQL 查询并获取结果
  return result.count // 返回历史记录的数量
}

// 删除历史记录
export function dropHistory(): boolean {
  try {
    const query = `
        DELETE
        FROM history;
    `
    const stmt = database.prepare(query)
    stmt.run() // 执行 DELETE 语句
    return true // 如果没有错误发生，返回 true
  } catch (error) {
    console.error("Error deleting history records:", error)
    return false // 如果有错误发生，捕获异常并返回 false
  }
}

// 添加收藏
export function insertIntoFavourite(resourceType: resourceType, resourceId: number) {
  const insertSQL = `
      INSERT INTO favourite (resource_type, resource_id)
      VALUES (?, ?);
  `
  database.prepare(insertSQL).run(resourceType, resourceId)
}

// 查询收藏记录，可选参数为资源类型，如果不传则查询所有
export function queryFavourite(resourceType?: resourceType): FavouriteItem[] {
  let selectSQL = `
      SELECT id, resource_type as resourceType, resource_id as resourceId, gmt_create as gmtCreate
      FROM favourite
  `
  if (resourceType) {
    selectSQL += "WHERE resource_type = ?"
  }
  selectSQL += "ORDER BY gmt_create DESC;"
  if (resourceType) {
    return database.prepare(selectSQL).all(resourceType) as FavouriteItem[]
  }
  return database.prepare(selectSQL).all() as FavouriteItem[]
}

// 删除收藏记录
export function dropFavourite(): boolean {
  try {
    const query = `
        DELETE
        FROM favourite;
    `
    const stmt = database.prepare(query)
    stmt.run()
    return true
  } catch (error) {
    console.error("Error deleting favourite records:", error)
    return false
  }
}

// 删除单个收藏记录
export function deleteFavourite(resourceType: resourceType, resourceId: number): boolean {
  try {
    const query = `
        DELETE
        FROM favourite
        WHERE resource_type = ?
          AND resource_id = ?;
    `
    const stmt = database.prepare(query)
    stmt.run(resourceType, resourceId)
    return true
  } catch (error) {
    console.error("Error deleting favourite record:", error)
    return false
  }
}

// 查询追剧记录
export function queryWatching(): WatchingItem[] {
  const selectSQL = `
      SELECT id, resource_id as resourceId, gmt_create as gmtCreate
      FROM watching
      ORDER BY gmt_create DESC;
  `
  return database.prepare(selectSQL).all() as WatchingItem[]; // Add return statement
}

// 添加追剧记录
export function insertIntoWatching(resourceId: number) {
  const insertSQL = `
      INSERT INTO watching (resource_id)
      VALUES (?);
  `
  database.prepare(insertSQL).run(resourceId)
}

// 删除追剧记录
export function deleteWatching(resourceId: number): boolean {
  try {
    const query = `
        DELETE
        FROM watching
        WHERE resource_id = ?;
    `
    const stmt = database.prepare(query)
    stmt.run(resourceId)
    return true
  } catch (error) {
    console.error("Error deleting watching record:", error)
    return false
  }
}

// 删除所有追剧记录
export function dropWatching(): boolean {
  try {
    const query = `
        DELETE
        FROM watching;
    `
    const stmt = database.prepare(query)
    stmt.run()
    return true
  } catch (error) {
    console.error("Error deleting watching records:", error)
    return false
  }
}

// 查询单条追剧记录
export function queryWatchingItem(resourceId: number): boolean {
  const selectSQL = `
      SELECT count(*) as count
      FROM watching
      WHERE resource_id = ?;
  `
  const stmt = database.prepare(selectSQL)
  const result = stmt.get(resourceId) as { count: number }
  return result.count > 0
}

export function getSqlite3(filename = path.join(app.getPath("userData"), "better-sqlite3.sqlite3")) {
  if (!database) {
    database = new Database(filename, {
      nativeBinding: path.join(root, import.meta.env.VITE_BETTER_SQLITE3_BINDING)
    })
    initializeDatabase(database)
  }
  return database
}
