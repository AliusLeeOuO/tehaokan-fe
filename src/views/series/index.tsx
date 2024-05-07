import { useEffect, useState } from "react"
import usePublicApi, { seriesResponseDataContent } from "../../xhr/publicApi.ts"
import MoviesBlock from "../../components/moviesBlock"
import PublicLoading from "../../components/publicLoading"
import style from "./index.module.less"
import { FavouriteItem } from "../../../electron/db-types.ts"

export default function Series() {
  // 声明新类型，给seriesResponseDataContent添加一个新属性 isFavourite
  type seriesResponseDataContentWithFavourite = seriesResponseDataContent & { isFavourite: boolean }
  const [movieList, setMovieList] = useState<seriesResponseDataContentWithFavourite[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { getSeries } = usePublicApi()

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
      window.ipcRenderer.send("query-favourite", "tv")
      // 监听响应
      window.ipcRenderer.on("query-favourite-reply", handleQueryFavouriteReply)
    })
  }

  async function fetchSeriesList() {
    try {
      setIsLoaded(false)
      const { data } = await getSeries()
      const favouriteData = await fetchFavourite()
      const seriesData: seriesResponseDataContentWithFavourite[] = data.content.map(item => {
        const isFavourite = favouriteData.some(favouriteItem => {
            return favouriteItem.resourceId === item.id
          }
        )
        return {
          ...item,
          isFavourite: isFavourite
        }
      })
      setMovieList(seriesData)
      setIsLoaded(true)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    (async function() {
      await fetchSeriesList()
    })()
    return () => {
      window.ipcRenderer.removeAllListeners("query-favourite-reply")
    }
  }, [])

  // 更新收藏状态
  const updateFavouriteStatus =async () => {
    // 仅更新收藏状态
    const favouriteData = await fetchFavourite()
    const updatedMovieList = movieList.map(item => {
      const isFavourite = favouriteData.some(favouriteItem => {
        return favouriteItem.resourceId === item.id
      })
      return {
        ...item,
        isFavourite: isFavourite
      }
    })
    setMovieList(updatedMovieList)
  }

  return <>
    {
      isLoaded ? <div className={style.seriesList}>
        {movieList.map(item => {
          return <MoviesBlock key={item.id}
                              movieName={item.series_name}
                              imgPath={item.poster_url}
                              isFavourite={item.isFavourite}
                              resourceId={item.id}
                              resourceType="tv"
                              onFavouriteChange={updateFavouriteStatus}
          />
        })}
      </div> : <PublicLoading />
    }
  </>
}
