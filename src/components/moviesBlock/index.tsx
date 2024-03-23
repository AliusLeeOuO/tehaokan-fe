import { FC } from "react"
import { Image, Skeleton } from "@arco-design/web-react"
import style from "./index.module.less"
import "./index.override.less"

interface ChildProps {
  movieName: string
  imgPath: string
}


const ChildComponent: FC<ChildProps> = (props) => {
  const openPlayerWindow = () => {
    window.ipcRenderer.send("open-player-window", {
      type: "movie",
      resourceId: 123456,
    })
  }


  return (
    <div className={`${style.movieBlock} movie-block-override`} onClick={openPlayerWindow}>
      <div className={style.movieImg}>
        <Image
          preview={false}
          simple={true}
          style={{ width: "100%", height: "100%" }}
          src={props.imgPath}
          alt="movie image"
          lazyload={{ threshold: 0.5 }}
          loader={<Skeleton
            animation
            style={{ height: "100%", width: "100%" }}
            text={false}
            image={{
              style: {
                width: "100%",
                height: "100%",
                marginRight: "0"
              }
            }}
          />}
        />
      </div>
      <div className={style.movieName}>{props.movieName}</div>
    </div>
  )
}

export default ChildComponent