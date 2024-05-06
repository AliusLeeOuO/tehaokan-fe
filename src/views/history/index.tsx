import React, { useEffect, useState, useMemo } from "react"
import dayjs from "dayjs"
import HistoryBlock from "../../components/historyBlock"
import style from "./index.module.less"
import { Empty } from "@arco-design/web-react"
import { resourceType } from "../../../electron/dbTypes.ts"

// 定义历史记录项的类型
interface HistoryItem {
  id: number;
  resource_type: resourceType;
  resource_id: number;
  gmt_create: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([])


  const fetchHistory = () => {
    const handleQueryHistoryReply = (_event: any, historyData: HistoryItem[]) => {
      setHistory(historyData)
    }
    // 移除之前的监听器
    window.ipcRenderer.off("query-history-reply", handleQueryHistoryReply)
    // 请求历史记录数据
    window.ipcRenderer.send("query-history")
    // 监听响应
    window.ipcRenderer.on("query-history-reply", handleQueryHistoryReply)
  }

  useEffect(() => {
    fetchHistory()
    // 组件卸载时移除监听器
    return () => {
      window.ipcRenderer.removeAllListeners("query-history-reply")
    }
  }, [])

  const historyByDate = useMemo(() => {
    return history.reduce((acc: { [key: string]: HistoryItem[] }, item: HistoryItem) => {
      const today = dayjs()
      const yesterday = dayjs().subtract(1, "day")
      let label

      const itemDate = dayjs(item.gmt_create)
      if (itemDate.isSame(today, "day")) {
        label = "今天"
      } else if (itemDate.isSame(yesterday, "day")) {
        label = "昨天"
      } else {
        label = itemDate.format("YYYY-MM-DD")
      }

      if (!acc[label]) {
        acc[label] = []
      }
      acc[label].push(item)
      return acc
    }, {})
  }, [history])

  return (
    <>
      {
        history.length === 0 ? (
        <div className={style.empty}>
          <Empty description="还没有历史记录"/>
        </div>
        ) : (
          <div className={style.historyContainer}>
            {Object.entries(historyByDate).map(([date, items]) => (
              <div key={date}>
                <div className={style.historyDate}>{date}</div>
                <div className={style.historyList}>
                  {items.map((item: HistoryItem) => (
                    <HistoryBlock key={item.id} resourceId={item.resource_id} resourceType={item.resource_type} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      }
    </>
  )
}

export default History
