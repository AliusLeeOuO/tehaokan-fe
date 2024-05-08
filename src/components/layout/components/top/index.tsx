import style from "./index.module.less"
import LogoImage from "../../../../assets/images/header/header-logo.png"
import { NavLink, useLocation } from "react-router-dom"
import Search from "../search"
import MinimizeIcon from "../../../icons/minimizeIcon.tsx"
import MaximizeIcon from "../../../icons/maximizeIcon.tsx"
import CloseIcon from "../../../icons/closeIcon.tsx"
import { useSelector } from "react-redux"
import { RootState } from "../../../../store/store.ts"
import ExitModal from "../../../exitModal"
import { useState } from "react"

export default function Top() {
  // selector 是否显示
  const location = useLocation()
  // 定义不显示selector的路由列表
  const hiddenRoutes = ["/favourites", "/history", "/settings"]
  // 检查当前路由是否在隐藏列表中
  const showSelector = !hiddenRoutes.includes(location.pathname)

  const minimizeApp = () => {
    window.ipcRenderer.send("minimize-window")
  }
  const maximizeApp = () => {
    window.ipcRenderer.send("maximize-window")
  }
  const [visibleCloseModal, setVisibleCloseModal] = useState(false)
  const confirmOnClose = useSelector((state: RootState) => state.settings.confirmOnClose)
  const closeApp = () => {
    if (confirmOnClose) {
      setVisibleCloseModal(true)
    } else {
      conformCloseCallBack()
    }
  }
  const minimizeToTray = useSelector((state: RootState) => state.settings.minimizeToTray)
  const conformCloseCallBack = () => {
    if (minimizeToTray) {
      setVisibleCloseModal(false)
      window.ipcRenderer.send("minimize-to-tray")
    } else {
      window.ipcRenderer.send("close-window")
    }
  }

  return (
    <>
      <header>
        <div className={style.logo}>
          <img src={LogoImage} alt="logo" />
        </div>
        {
          showSelector && (
            <div className={style.selector}>
              <NavLink to="/index/recommend"
                       className={({ isActive }) => isActive ? `${style.selectorItem} ${style.selectorItemActive}` : `${style.selectorItem}`}>
                <span>推荐</span>
              </NavLink>
              <NavLink to="/index/movies"
                       className={({ isActive }) => isActive ? `${style.selectorItem} ${style.selectorItemActive}` : `${style.selectorItem}`}>
                <span>电影</span>
              </NavLink>
              <NavLink to="/index/series"
                       className={({ isActive }) => isActive ? `${style.selectorItem} ${style.selectorItemActive}` : `${style.selectorItem}`}>
                <span>剧集</span>
              </NavLink>
              <NavLink to="/index/subscription"
                       className={({ isActive }) => isActive ? `${style.selectorItem} ${style.selectorItemActive}` : `${style.selectorItem}`}>
                <span>追剧</span>
              </NavLink>
            </div>
          )
        }
        <div className={style.rightZone}>
          <Search />
          <div className={style.actionButtons}>
            <div className={style.actionButton} onClick={minimizeApp}>
              <MinimizeIcon />
            </div>
            <div className={style.actionButton} onClick={maximizeApp}>
              <MaximizeIcon />
            </div>
            <div className={style.actionButton} onClick={closeApp}>
              <CloseIcon />
            </div>
          </div>
        </div>
      </header>
      <ExitModal visible={visibleCloseModal} setVisible={setVisibleCloseModal} />
    </>
  )
}
