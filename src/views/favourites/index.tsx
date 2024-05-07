import React, { useEffect, useState } from "react"
import HistoryBlock from "../../components/historyBlock"
import style from "./index.module.less"
import { Empty } from "@arco-design/web-react"
import { FavouriteItem } from "../../../electron/db-types.ts"
import { motion, AnimatePresence } from "framer-motion"

const Favourite: React.FC = () => {
  const [favourite, setFavourite] = useState<FavouriteItem[]>([])

  const fetchFavourite = () => {
    const handleQueryFavouriteReply = (_event: any, favouriteData: FavouriteItem[]) => {
      setFavourite(favouriteData)
    }
    // 移除之前的监听器
    window.ipcRenderer.off("query-favourite-reply", handleQueryFavouriteReply)
    // 请求历史记录数据
    window.ipcRenderer.send("query-favourite")
    // 监听响应
    window.ipcRenderer.on("query-favourite-reply", handleQueryFavouriteReply)
  }

  useEffect(() => {
    fetchFavourite()
    // 组件卸载时移除监听器
    return () => {
      window.ipcRenderer.removeAllListeners("query-favourite-reply")
    }
  }, [])

  // 重新获取收藏列表
  const updateFavouriteList = () => {
    fetchFavourite()
  }


  return (
    // TODO: 动画效果等待调整
    <AnimatePresence mode="wait">
      {favourite.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={style.empty}
          transition={{ duration: 0.1 }}
        >
          <div>
            <Empty description="还没有收藏" />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="favourite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className={style.favouriteContainer}>
            <AnimatePresence>
              {favourite.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <HistoryBlock resourceId={item.resourceId} resourceType={item.resourceType} isFavourite={true}
                                onFavouriteChange={updateFavouriteList} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

}

export default Favourite
