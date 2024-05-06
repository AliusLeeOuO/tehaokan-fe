import { FC, useEffect, useState } from "react"
import { Skeleton, Tooltip } from "@arco-design/web-react"
import { useRef } from "react"
import style from "./index.module.less"
import "./index.override.less"
import LikeIcon from "../icons/likeIcon.tsx"
import { resourceType } from "../../../electron/dbTypes.ts"

interface ChildProps {
  movieName: string
  imgPath: string
  resourceId: number
  resourceType: resourceType
  // 收藏状态
  isFavourite: boolean
}


const ChildComponent: FC<ChildProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isImgLoaded, setIsImgLoaded] = useState(false)
  const openPlayerWindow = () => {
    window.ipcRenderer.send("open-player-window", {
      type: props.resourceType,
      resourceId: props.resourceId
    })
    insertIntoHistory()
  }

  function insertIntoHistory() {
    window.ipcRenderer.send("insert-history", props.resourceType, props.resourceId)
  }

  useEffect(() => {
    const img = new Image()
    img.src = props.imgPath
    img.onload = () => {
      setIsImgLoaded(true) // 图像加载完成
      const canvas = canvasRef.current
      let DPR = window.devicePixelRatio
      let w = canvas!.clientWidth
      let h = canvas!.clientHeight
      if (canvas && DPR) {
        canvas.width = w * DPR
        canvas.height = h * DPR
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
      }
    }
  }, [props.imgPath])


  return (
    <div className={`${style.movieBlock} movie-block-override`} onClick={openPlayerWindow}>
      <div className={style.movieImg}>
        <Skeleton
          animation
          text={false}
          image={{
            style: {
              width: "100%",
              height: "100%",
              marginRight: "0"
            }
          }}
          className={`${isImgLoaded ? `${style.skeletonInactive} ${style.skeleton}` : `${style.skeletonActive} ${style.skeleton}`}`}
        />
        <canvas
          ref={canvasRef}
          className={`${isImgLoaded ? `${style.canvasActive} ${style.canvas}` : `${style.canvasInactive} ${style.canvas}`}`}
        ></canvas>
        <div className={style.favourite}>
          <Tooltip position="bottom" trigger="hover" content={props.isFavourite ? "取消收藏" : "收藏"}>
            <div className={style.likeIcon}><LikeIcon /></div>
          </Tooltip>
        </div>
      </div>
      <div className={style.movieName}>{props.movieName}</div>
    </div>
  )
}

export default ChildComponent
