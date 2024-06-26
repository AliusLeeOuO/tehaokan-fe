import style from "./index.module.less"
import usePublicApi, { recommendedResponseDataContent } from "../../xhr/publicApi.ts"
import { useEffect, useState } from "react"
import MoviesBlock from "../../components/moviesBlock"
import PublicLoading from "../../components/publicLoading"
import { type FavouriteItem, type resourceType } from "../../../electron/db-types.ts"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store.ts"

export default function Recommend() {
  // 声明新类型，给recommendedResponseDataContent添加一个新属性 isFavourite
  type recommendedResponseDataContentWithFavourite = recommendedResponseDataContent & { isFavourite: boolean }

  const { getRecommended } = usePublicApi()
  const [isLoaded, setIsLoaded] = useState(false)
  const [recommended, setRecommended] = useState<recommendedResponseDataContentWithFavourite[]>([])

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

  async function fetchRecommended() {
    try {
      // 获取收藏列表
      setIsLoaded(false)
      const response = await getRecommended()
      // 将收藏列表与推荐列表进行比对，标记收藏状态
      const favouriteData = await fetchFavourite()
      const recommendedData: recommendedResponseDataContentWithFavourite[] = response.data.content.map(item => {
        // 判断是否为收藏
        const isFavourite = favouriteData.some(favouriteItem => {
            return favouriteItem.resourceType === item.type && favouriteItem.resourceId === item.id
          }
        )
        return {
          ...item,
          isFavourite: isFavourite
        }
      })
      // 更新推荐列表
      setRecommended(recommendedData)
      setIsLoaded(true)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    (async () => {
      await fetchRecommended()
    })()
    return () => {
      window.ipcRenderer.removeAllListeners("query-favourite-reply")
    }
  }, [])


  // 更新收藏状态
  const updateFavouriteStatus = async (resourceType: resourceType, resourceId: number, newStatus: boolean) => {
    // 仅更新收藏状态，不需要重新获取推荐列表
    // 找到这个元素直接更新state
    const newRecommended = recommended.map(item => {
      if (item.id === resourceId && item.type === resourceType) {
        return {
          ...item,
          isFavourite: newStatus
        }
      }
      return item
    })
    setRecommended(newRecommended)
  }

  // 根据搜索值筛选推荐列表
  const [filteredRecommended, setFilteredRecommended] = useState<recommendedResponseDataContentWithFavourite[]>([])
  const searchValue = useSelector((state: RootState) => state.search.searchValue)
  useEffect(() => {
    // 根据搜索值筛选推荐列表
    const filteredData = recommended.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))
    setFilteredRecommended(filteredData)
  }, [searchValue, recommended])

  return <>
    {
      isLoaded ? <div className={style.recommendList}>
        {filteredRecommended.map(item => {
          return <MoviesBlock
            key={item.name}
            movieName={item.name}
            imgPath={item.poster_url}
            resourceId={item.id}
            resourceType={item.type}
            isFavourite={item.isFavourite}
            onFavouriteChange={updateFavouriteStatus}
          />
        })}
      </div> : <PublicLoading />
    }
  </>
}
