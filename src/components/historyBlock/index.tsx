import { FC, useEffect, useState } from "react"
import { Skeleton } from "@arco-design/web-react"
import { useRef } from "react"
import style from "./index.module.less"
import "./index.override.less"
import usePublicApi from "../../xhr/publicApi.ts"
import { resourceType } from "../../../electron/dbTypes.ts"

interface ChildProps {
  resourceId: number
  resourceType: resourceType
}


const ChildComponent: FC<ChildProps> = (props) => {
  const { getMovieInfoById, getTvInfoById } = usePublicApi()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isImgLoaded, setIsImgLoaded] = useState(false)

  const [resourceInfo, setResourceInfo] = useState({
    movieName: "",
    imgPath: ""
  })

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

  const fetchResourceInfo = async () => {
    if (props.resourceType === "movie") {
      const response = await getMovieInfoById(props.resourceId)
      setResourceInfo({
        movieName: response.data.name,
        imgPath: response.data.poster_url
      })
    } else if (props.resourceType === "tv") {
      const response = await getTvInfoById(props.resourceId)
      setResourceInfo({
        movieName: response.data.series_name,
        imgPath: response.data.poster_url
      })
    }
  }

  function loadImage() {
    const img = new Image()
    img.src = resourceInfo.imgPath
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
  }

  useEffect(() => {
    fetchResourceInfo()
  }, [])

  useEffect(() => {
    if (resourceInfo.imgPath) {
      loadImage()
    }
    // 这个 useEffect 依赖于 resourceInfo.imgPath，
    // 每当 imgPath 更新时，都会调用 loadImage
  }, [resourceInfo.imgPath])


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
      <div className={style.movieName}>{resourceInfo.movieName}</div>
    </div>
  )
}

export default ChildComponent
