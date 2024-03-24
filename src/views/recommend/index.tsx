import style from "./index.module.less"
import usePublicApi, { recommendedResponseDataContent } from "../../xhr/publicApi.ts"
import { useEffect, useState } from "react"
import MoviesBlock from "../../components/moviesBlock"
import PublicLoading from "../../components/publicLoading"

export default function Recommend() {
  const { getRecommended } = usePublicApi()
  const [isLoaded, setIsLoaded] = useState(false)
  const [recommended, setRecommended] = useState<recommendedResponseDataContent[]>([])

  async function fetchRecommended() {
    try {
      setIsLoaded(false)
      const response = await getRecommended()
      setRecommended(response.data.content)
      setIsLoaded(true)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    (async () => {
      await fetchRecommended()
    })()
  }, [])

  return <>
    {
      isLoaded ? <div className={style.recommendList}>
        {recommended.map(item => {
          return <MoviesBlock key={item.name} movieName={item.name} imgPath={item.poster_url} />
        })}
      </div> : <PublicLoading />
    }
  </>
}