import Player from "xgplayer"
import "xgplayer/dist/index.min.css"
import style from "./index.module.less"
import CloseIcon from "../../components/icons/closeIcon.tsx"
import MinimizeIcon from "../../components/icons/minimizeIcon.tsx"
import MaximizeIcon from "../../components/icons/maximizeIcon.tsx"
import { useEffect, useState } from "react"

export default function PlayerComponent() {
  const [, setResourceType] = useState<"movie" | "tv" | "">("")
  const [, setResourceId] = useState<number | null>(null)

  useEffect(() => {
    const type = window.ipcRenderer.getType()
    const resourceId = window.ipcRenderer.getResourceId()
    setResourceType(type)
    setResourceId(resourceId)

    new Player({
      id: "player-container",
      height: "100%",
      width: "100%",
      playbackRate: [],
      cssFullscreen: false,
      volume: 1,
      poster: "",
      url: ""
    })
  }, [])

  return (
    <>
      <div className={style.tab}>
        <div className={style.resourceName}>
          我是标题
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
        <div id="player-container"></div>
      </div>
    </>
  )
}