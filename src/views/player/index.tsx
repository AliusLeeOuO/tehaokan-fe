import Player from "xgplayer"
import "xgplayer/dist/index.min.css"
import style from "./index.module.less"
import "./index.override.less"
import CloseIcon from "../../components/icons/closeIcon.tsx"
import MinimizeIcon from "../../components/icons/minimizeIcon.tsx"
import MaximizeIcon from "../../components/icons/maximizeIcon.tsx"
import InBlockLikeIcon from "../../components/icons/inBlockLikeIcon.tsx"
import { useEffect, useRef, useState } from "react"
import usePublicApi, { type tvListItem } from "../../xhr/publicApi.ts"
import { resourceType } from "../../../electron/db-types.ts"
import { Tooltip } from "@arco-design/web-react"


export default function PlayerComponent() {
  const [resourceType, setResourceType] = useState<resourceType | "">("")
  const [, setResourceLoading] = useState(true)
  const [tvList, setTvList] = useState<tvListItem[]>([])
  const { getMovieInfoById, getTvInfoById } = usePublicApi()
  const [posterUrl, setPosterUrl] = useState<string>("")
  // const [resourceType, setResourceType] = useState<"movie" | "tv" | "">("")
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null)

  const [movieName, setMovieName] = useState<string>("")

  // const [, setResourceId] = useState<number | null>(null)

  const playerInstance = useRef<any>(null)

  const initPlayer = (url: string, poster: string) => {
    // 先杀掉之前的播放器
    if (playerInstance.current) {
      playerInstance.current.destroy()
    }
    // 初始化播放器
    playerInstance.current = new Player({
      id: "player-container",
      height: "100%",
      width: "100%",
      playbackRate: [],
      cssFullscreen: false,
      volume: 0.05,
      poster: poster,
      url: url,
      commonStyle: {
        playedColor: "#31b2bb",
        volumeColor: "#31b2bb"
      }
    })
  }

  useEffect(() => {
    const type = window.ipcRenderer.getType()
    const resourceId = window.ipcRenderer.getResourceId()
    setResourceLoading(true)


    if (type === "movie") {
      setResourceType("movie")
      getMovieInfoById(resourceId).then((res) => {
        const { poster_url, video_url } = res.data
        setMovieName(res.data.name)
        initPlayer(video_url, poster_url)
        setPosterUrl(poster_url)
        setResourceLoading(false)
      })
    } else if (type === "tv") {
      setResourceType("tv")
      getTvInfoById(resourceId).then((res) => {
        setTvList(res.data.episodes)
        setMovieName(res.data.series_name)
        initPlayer(res.data.episodes[0].url, res.data.poster_url)
        setCurrentPlayingIndex(0)
        setPosterUrl(res.data.poster_url)
        setResourceLoading(false)
      })
    }
  }, [])

  const changeResource = (resourceId: number) => {
    return function() {
      setResourceLoading(true)
      initPlayer(tvList[resourceId].url, posterUrl)
      setCurrentPlayingIndex(resourceId)
      setResourceLoading(false)
    }
  }

  const minimizeWindow = () => {
    window.ipcRenderer.send("minimize-player-window")
  }

  const maximizeWindow = () => {
    window.ipcRenderer.send("maximize-player-window")
  }

  const closeWindow = () => {
    window.ipcRenderer.send("close-player-window")
  }

  return (
    <>
      <div className={style.tab}>
        <div className={style.resourceName}>
          {movieName}
        </div>
        <div className={style.actionButtons}>
          <div className={style.actionButton} onClick={minimizeWindow}>
            <MinimizeIcon />
          </div>
          <div className={style.actionButton} onClick={maximizeWindow}>
            <MaximizeIcon />
          </div>
          <div className={style.actionButton} onClick={closeWindow}>
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
                <div>播放列表</div>
                <div className={style.playListActions}>
                  <Tooltip position="bottom" trigger="hover" content="追剧" className="tooltipOverride"
                           popupHoverStay={false}>
                    <div className={style.ActionIcon}><InBlockLikeIcon /></div>
                  </Tooltip>
                </div>
              </div>
              <div className={style.playListContent}>
                {
                  tvList.map((item, index) => {
                    return (
                      <div key={index}
                           className={`${style.playListItem} ${index === currentPlayingIndex ? style.playListItemActive : ""}`}
                           onClick={changeResource(index)}>
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
