import { FC } from "react"
import style from "./index.module.less"

interface ChildProps {
  movieName: string
  imgPath: string
}


const ChildComponent: FC<ChildProps> = (props) => {
  return (
    <div className={style.movieBlock}>
      <div className={style.movieImg}>
        <img src={props.imgPath} alt="" />
      </div>
      <div className={style.movieName}>{props.movieName}</div>
    </div>
  )
}

export default ChildComponent