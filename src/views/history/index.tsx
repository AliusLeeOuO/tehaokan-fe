import React, { useEffect, useState, useMemo } from "react"
import dayjs from "dayjs"
import HistoryBlock from "../../components/historyBlock"
import style from "./index.module.less"

// 定义历史记录项的类型
interface HistoryItem {
  id: number;
  resource_type: "movie" | "tv";
  resource_id: number;
  gmt_create: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const handleQueryHistoryReply = (_event: any, historyData: HistoryItem[]) => {
      setHistory(historyData)
    }

    // 请求历史记录数据
    window.ipcRenderer.send("query-history")
    // 监听响应
    window.ipcRenderer.on("query-history-reply", handleQueryHistoryReply)

    // 组件卸载时移除监听器
    return () => {
      window.ipcRenderer.removeAllListeners("query-history-reply")
    }
  }, [])

  const historyByMonth = useMemo(() => {
    return history.reduce((acc: { [key: string]: HistoryItem[] }, item: HistoryItem) => {
      const month = dayjs(item.gmt_create).format("YYYY-MM") // 使用dayjs格式化日期
      if (!acc[month]) {
        acc[month] = []
      }
      acc[month].push(item)
      return acc
    }, {})
  }, [history])

  return (
    <>
      <div>
        {Object.entries(historyByMonth).map(([month, items]) => (
          <div key={month}>
            <h2 className={style.historyMonth}>{month}</h2>
            <div className={style.historyList}>
              {items.map((item: HistoryItem) => (
                <HistoryBlock key={item.id} resourceId={item.resource_id} resourceType={item.resource_type} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default History
