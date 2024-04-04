import Player from "xgplayer"
import "xgplayer/dist/index.min.css"
import style from "./index.module.less"
import CloseIcon from "../../components/icons/closeIcon.tsx"
import MinimizeIcon from "../../components/icons/minimizeIcon.tsx"
import MaximizeIcon from "../../components/icons/maximizeIcon.tsx"
import { useEffect, useState } from "react"
import usePublicApi, { type tvListItem } from "../../xhr/publicApi.ts"

export default function PlayerComponent() {
  const [resourceType, setResourceType] = useState<"movie" | "tv" | "">("")
  const [resourceLoading, setResourceLoading] = useState(true)
  const [tvList, setTvList] = useState<tvListItem[]>([])
  const { getMovieInfoById, getTvInfoById } = usePublicApi()
  // const [resourceType, setResourceType] = useState<"movie" | "tv" | "">("")

  const [movieName, setMovieName] = useState<string>("")

  // const [, setResourceId] = useState<number | null>(null)

  useEffect(() => {
    const type = window.ipcRenderer.getType()
    const resourceId = window.ipcRenderer.getResourceId()
    // setResourceType(type)
    // setResourceId(resourceId)

    if (type === "movie") {
      setResourceType("movie")
      getMovieInfoById(resourceId).then((res) => {
        const { poster_url, video_url } = res.data
        setMovieName(res.data.name)
        new Player({
          id: "player-container",
          height: "100%",
          width: "100%",
          playbackRate: [],
          cssFullscreen: false,
          volume: 1,
          poster: poster_url,
          url: video_url,
          commonStyle: {
            playedColor: "#31b2bb",
            volumeColor: "#31b2bb"
          }
        })
        setResourceLoading(false)
      })
    } else if (type === "tv") {
      setResourceType("tv")
      getTvInfoById(resourceId).then((res) => {
        setTvList(res.data.episodes)
        setMovieName(res.data.series_name)
        new Player({
          id: "player-container",
          height: "100%",
          width: "100%",
          playbackRate: [],
          cssFullscreen: false,
          volume: 1,
          poster: res.data.poster_url,
          url: res.data.episodes[0].url,
          commonStyle: {
            playedColor: "#31b2bb",
            volumeColor: "#31b2bb"
          }
        })
        setResourceLoading(false)
      })
    }
  }, [])

  return (
    <>
      <div className={style.tab}>
        <div className={style.resourceName}>
          {movieName}
        </div>
        <div className={style.actionButtons}>
          <div className={style.actionButton}>
            <MinimizeIcon />
          </div>
          <div className={style.actionButton}>
            <MaximizeIcon />
          </div>
          <div className={style.actionButton}>
            <CloseIcon />
          </div>
        </div>
      </div>
      <div className={style.player}>
        <div id="player-container" className={style.playerContainer}></div>
        {
          resourceType === "tv" ?
            <div className={`${style.playList} ${style.playListActive}`}>
              <div className={style.playListTitle}>
                播放列表
              </div>
              <div className={style.playListContent}>
                {
                  tvList.map((item, index) => {
                    return (
                      <div key={index} className={style.playListItem}>
                        {item.episode_name}
                      </div>
                    )
                  })
                }
              </div>
            </div>
            :
            <></>
        }
      </div>
    </>
  )
}