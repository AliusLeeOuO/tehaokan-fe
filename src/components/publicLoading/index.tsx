import style from "./index.module.less"
import { Spin } from "@arco-design/web-react"

interface PublicLoadingProps {
  fullScreen?: boolean
  backgroundColor?: string
}

export default function publicLoading({ fullScreen = false, backgroundColor = "#fff" }: PublicLoadingProps = {}) {
  return <>
    <div
      className={fullScreen ? `${style.spinContainer} ${style.spinContainerFullScreen}` : `${style.spinContainer}`}
      style={{ backgroundColor }}
    >
      <Spin size={40} tip="正在加载页面"/>
    </div>
  </>
}
