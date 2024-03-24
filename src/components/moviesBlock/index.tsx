import { FC, useEffect, useState } from "react"
import { Skeleton } from "@arco-design/web-react"
import { useRef } from "react"
import style from "./index.module.less"
import "./index.override.less"

interface ChildProps {
  movieName: string
  imgPath: string
}


const ChildComponent: FC<ChildProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isImgLoaded, setIsImgLoaded] = useState(false)
  const openPlayerWindow = () => {
    window.ipcRenderer.send("open-player-window", {
      type: "movie",
      resourceId: 123456
    })
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
      </div>
      <div className={style.movieName}>{props.movieName}</div>
    </div>
  )
}

export default ChildComponent