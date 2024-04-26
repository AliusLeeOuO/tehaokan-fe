import style from "./index.module.less"
import LogoImage from "../../assets/images/header/header-logo.png"
import SearchIcon from "../../assets/images/header/58sousuo.svg"

import { Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom"
import CloseIcon from "../icons/closeIcon.tsx"
import MaximizeIcon from "../icons/maximizeIcon.tsx"
import MinimizeIcon from "../icons/minimizeIcon.tsx"
import { lazy, Suspense, useState } from "react"
import PublicLoading from "../publicLoading"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store.ts"
import ExitModal from "../exitModal"
import Nav from "../nav"

const Movies = lazy(() => import("../../views/movies"))
const Recommend = lazy(() => import("../../views/recommend"))
const Series = lazy(() => import("../../views/series"))
const Subscription = lazy(() => import("../../views/subscription"))
const Favourites = lazy(() => import("../../views/favourites"))
const History = lazy(() => import("../../views/history"))
const Settings = lazy(() => import("../../views/settings"))


export default function Layout() {
  const minimizeToTray = useSelector((state: RootState) => state.settings.minimizeToTray)
  const confirmOnClose = useSelector((state: RootState) => state.settings.confirmOnClose)

  const [visibleCloseModal, setVisibleCloseModal] = useState(false)

  const minimizeApp = () => {
    window.ipcRenderer.send("minimize-window")
  }
  const maximizeApp = () => {
    window.ipcRenderer.send("maximize-window")
  }

  const closeApp = () => {
    if (confirmOnClose) {
      setVisibleCloseModal(true)
    } else {
      conformCloseCallBack()
    }
  }
  const conformCloseCallBack = () => {
    if (minimizeToTray) {
      setVisibleCloseModal(false)
      window.ipcRenderer.send('minimize-to-tray')
    } else {
      window.ipcRenderer.send("close-window")
    }
  }

  // selector 与 search-item 是否显示
  const location = useLocation()
  // 定义不显示selector的路由列表
  const hiddenRoutes = ["/favourites", "/history", "/settings"]
  // 检查当前路由是否在隐藏列表中
  const showSelector = !hiddenRoutes.includes(location.pathname)

  return (
    <>
      <div className={style.layout}>
        <Nav />
        <div className={style.layoutRight}>
          <header>
            <div className={style.logo}>
              <img src={LogoImage} alt="" />
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
              <div className={style.searchItem}>
                <div className={style.searchContainer}>
                  <input type="text" placeholder="搜索你喜欢的视频" className={style.searchInput} />
                  <img src={SearchIcon} alt="" className={style.searchIcon} />
                </div>
              </div>
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
          <main>
            <Suspense fallback={<PublicLoading />}>
              <Routes>
                <Route path="/index/recommend" element={<Recommend />} />
                <Route path="/index/movies" element={<Movies />} />
                <Route path="/index/series" element={<Series />} />
                <Route path="/index/subscription" element={<Subscription />} />
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/" element={<Navigate replace to="/index/recommend" />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
      <ExitModal visible={visibleCloseModal} setVisible={setVisibleCloseModal} />
    </>
  )
}