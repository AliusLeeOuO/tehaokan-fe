import { useEffect, useState } from "react"
import usePublicApi, { imDBResponseDataContent } from "../../xhr/publicApi.ts"
import MoviesBlock from "../../components/moviesBlock"
import style from "./index.module.less"
import { Spin } from "@arco-design/web-react"

export default function Movies() {
  const [movieList, setMovieList] = useState<imDBResponseDataContent[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { getImDB } = usePublicApi()

  async function fetchImDB() {
    try {
      setIsLoaded(false)
      const { data } = await getImDB()
      setMovieList(data.content)
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
          return <MoviesBlock key={item.id} movieName={item.name} imgPath={item.poster_url} />
        })}
      </div> : <div className={style.movieListSpin}>
        <Spin size={40} />
      </div>
    }
  </>
}