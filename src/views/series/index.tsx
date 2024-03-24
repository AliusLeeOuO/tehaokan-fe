import { useEffect, useState } from "react"
import usePublicApi, { seriesResponseDataContent } from "../../xhr/publicApi.ts"
import MoviesBlock from "../../components/moviesBlock"
import PublicLoading from "../../components/publicLoading"
import style from "./index.module.less"

export default function Series() {
  const [movieList, setMovieList] = useState<seriesResponseDataContent[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { getSeries } = usePublicApi()

  async function fetchSeriesList() {
    try {
      setIsLoaded(false)
      const { data } = await getSeries()
      setMovieList(data.content)
      setIsLoaded(true)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    (async function() {
      await fetchSeriesList()
    })()
  }, [])

  return <>
    {
      isLoaded ? <div className={style.seriesList}>
        {movieList.map(item => {
          return <MoviesBlock key={item.id} movieName={item.series_name} imgPath={item.poster_url} />
        })}
      </div> : <PublicLoading />
    }
  </>
}