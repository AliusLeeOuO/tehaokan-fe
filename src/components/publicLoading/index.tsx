import style from "./index.module.less"
import { Spin } from "@arco-design/web-react"

export default function publicLoading() {
  return <div className={style.spinContainer}>
    <Spin size={40} />
  </div>
}