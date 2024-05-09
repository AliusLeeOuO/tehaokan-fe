import React, { useEffect, useState } from "react"
import HistoryBlock from "../../components/historyBlock"
import style from "./index.module.less"
import { Empty } from "@arco-design/web-react"
import { type resourceType, type FavouriteItem, type WatchingItem } from "../../../electron/db-types.ts"
import { motion, AnimatePresence } from "framer-motion"

const Favourite: React.FC = () => {
  // 声明新类型，给WatchingItem添加一个新属性 isFavourite
  type WatchingItemWithFavourite = WatchingItem & { isFavourite: boolean }
  const [followList, setFollowList] = useState<WatchingItemWithFavourite[]>([])

  // 从数据库获取收藏列表
  // 使用query-favourite事件获取收藏列表
  // 使用query-favourite-reply事件接收收藏列表
  async function fetchFavourite(): Promise<FavouriteItem[]> {
    return new Promise((resolve) => {
      const handleQueryFavouriteReply = (_event: any, favouriteData: FavouriteItem[]) => {
        // 移除监听器
        window.ipcRenderer.off("query-favourite-reply", handleQueryFavouriteReply)
        resolve(favouriteData)
      }
      // 移除之前的监听器
      window.ipcRenderer.off("query-favourite-reply", handleQueryFavouriteReply)
      // 请求收藏列表
      window.ipcRenderer.send("query-favourite")
      // 监听响应
      window.ipcRenderer.on("query-favourite-reply", handleQueryFavouriteReply)
    })
  }


  const fetchFollow = () => {
    const handleQueryFollowReply = async (_event: any, followData: FavouriteItem[]) => {
      // 获取收藏列表后，再获取追剧列表
      const favouriteData = await fetchFavourite()
      // 将追剧列表与收藏列表进行比对，标记收藏状态
      const followDataItems: WatchingItemWithFavourite[] = followData.map(item => {
        // 判断是否为收藏
        const isFavourite = favouriteData.some(favouriteItem => {
            return favouriteItem.resourceType === "tv" && favouriteItem.resourceId === item.resourceId
          }
        )
        return {
          ...item,
          isFavourite
        }
      })
      // 更新追剧列表
      setFollowList(followDataItems)
    }
    // 移除之前的监听器
    window.ipcRenderer.off("query-follow-reply", handleQueryFollowReply)
    // 请求历史记录数据
    window.ipcRenderer.send("query-follow")
    // 监听响应
    window.ipcRenderer.on("query-follow-reply", handleQueryFollowReply)
  }

  useEffect(() => {
    fetchFollow()
    // 组件卸载时移除监听器
    return () => {
      window.ipcRenderer.removeAllListeners("query-follow-reply")
    }
  }, [])

  const updateFollowList = (_resourceType: resourceType, resourceId: number, newStatus: boolean) => {
    setFollowList(prevFollowList => {
      if (newStatus) {
        // If newStatus is true, add the item to the list
        // Here, we're assuming that you have a way to fetch the full item data based on resourceType and resourceId
        const newItem: WatchingItemWithFavourite = {
          // 随机生成一个id
          id: Math.floor(Math.random() * 100000),
          resourceId,
          isFavourite: true,
          gmtCreate: new Date().toISOString()
        }
        newItem.isFavourite = true
        return [newItem, ...prevFollowList]
      } else {
        // If newStatus is false, remove the item from the list
        console.log(prevFollowList.filter(item => item.resourceId !== resourceId))
        return prevFollowList.filter(item => item.resourceId !== resourceId)
      }
    })
  }

  // 监听更新追剧IPC事件 update-watching-reply 用于更新追剧列表
  useEffect(() => {
    const handleUpdateFollowReply = (_event: any, resourceType: resourceType, resourceId: number, newStatus: boolean) => {
      window.ipcRenderer.off("update-follow-reply", handleUpdateFollowReply)
      console.log("update-follow-reply", resourceType, resourceId, newStatus)
      // 根据参数直接更新追剧列表
      updateFollowList(resourceType, resourceId, newStatus)
    }
    // 移除可能已经存在的监听器
    window.ipcRenderer.off("update-follow-reply", handleUpdateFollowReply)
    // 添加新的监听器
    window.ipcRenderer.on("update-follow-reply", handleUpdateFollowReply)
    // 当组件卸载时，移除监听器
    return () => {
      window.ipcRenderer.removeAllListeners("update-follow-reply")
    }
  }, [])


  return (
    <AnimatePresence mode="wait">
      {followList.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={style.empty}
          transition={{ duration: 0.1 }}
        >
          <div>
            <Empty description="还没有追剧" />
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
              {followList.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {/*TODO: isFavourite等待调整*/}
                  <HistoryBlock
                    resourceId={item.resourceId}
                    resourceType="tv"
                    isFavourite={item.isFavourite}
                    onFavouriteChange={updateFollowList}
                  />
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
