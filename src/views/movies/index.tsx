import { useEffect, useState } from "react"
import usePublicApi, { imDBResponseDataContent } from "../../xhr/publicApi.ts"
import MoviesBlock from "../../components/moviesBlock"
import style from "./index.module.less"
import PublicLoading from "../../components/publicLoading"
import { FavouriteItem } from "../../../electron/dbTypes.ts"

export default function Movies() {
  // 声明新类型，给imDBResponseDataContent添加一个新属性 isFavourite
  type imDBResponseDataContentWithFavourite = imDBResponseDataContent & { isFavourite: boolean }
  const [movieList, setMovieList] = useState<imDBResponseDataContentWithFavourite[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { getImDB } = usePublicApi()

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
      window.ipcRenderer.send("query-favourite", "movie")
      // 监听响应
      window.ipcRenderer.on("query-favourite-reply", handleQueryFavouriteReply)
    })
  }



  async function fetchImDB() {
    try {
      setIsLoaded(false)
      // 获取收藏列表
      const favouriteData = await fetchFavourite()
      const { data } = await getImDB()
      // 将收藏列表与imDB列表进行比对，标记收藏状态
      const movieData: imDBResponseDataContentWithFavourite[] = data.content.map(item => {
        // 判断是否为收藏
        const isFavourite = favouriteData.some(favouriteItem => {
          return favouriteItem.resourceId === item.id
        })
        return {
          ...item,
          isFavourite: isFavourite
        }
      })
      setMovieList(movieData)
      setIsLoaded(true)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    (async function() {
      await fetchImDB()
    })()
  }, [])

  return <>
    {
      isLoaded ? <div className={style.movieList}>
        {movieList.map(item => {
          return <MoviesBlock key={item.id} movieName={item.name} imgPath={item.poster_url}  resourceId={item.id} isFavourite={item.isFavourite} resourceType="movie"/>
        })}
      </div> : <PublicLoading />
    }
  </>
}
