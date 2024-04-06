import { app } from "electron"
import path from "node:path"
import Database from "better-sqlite3"

const root = path.join(__dirname, "..")
const TAG = "[better-sqlite3]"
let database: Database.Database

function initializeDatabase(database: Database.Database): void {
  // 创建历史记录表
  const createHistoryTableSQL = `
      CREATE TABLE IF NOT EXISTS history
      (
          id            INTEGER PRIMARY KEY AUTOINCREMENT,
          resource_type TEXT    NOT NULL,
          resource_id   INTEGER NOT NULL,
          gmt_create    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `
  database.prepare(createHistoryTableSQL).run()

  // 检查是否已存在用户
  // const userExists = database.prepare("SELECT COUNT(*) AS count FROM users WHERE username = ?").get("root") as {
  //   count: number
  // }
  // if (userExists.count === 0) {
  //   // 插入初始用户
  //   const insertUserSQL = `INSERT INTO users (username, password)
  //                          VALUES (?, ?);`
  //   database.prepare(insertUserSQL).run("root", "123456")
  // }
}

export function insertIntoHistory(resourceType: "movie" | "tv", resourceId: number) {
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
export function queryHistory(): { id: number, resourceType: string; resourceId: number; gmtCreate: string }[] {
  const selectSQL = `
      SELECT id, resource_type, resource_id, gmt_create
      FROM history
      ORDER BY gmt_create DESC;
  `
  // 使用typescript断言
  return database.prepare(selectSQL).all() as {
    id: number,
    resourceType: string;
    resourceId: number;
    gmtCreate: string
  }[]
}

//查询历史记录数量
export function historyCount(): number {
  const selectSQL = `
      select COUNT(*) as count
      from history
  `
  const stmt = database.prepare(selectSQL)
  const result = stmt.get() as { count: number } // 执行 SQL 查询并获取结果
  return result.count // 返回历史记录的数量
}

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


export function getSqlite3(filename = path.join(app.getPath("userData"), "better-sqlite3.sqlite3")) {
  if (!database) {
    database = new Database(filename, {
      nativeBinding: path.join(root, import.meta.env.VITE_BETTER_SQLITE3_BINDING)
    })
    initializeDatabase(database)
  }
  return database
}
