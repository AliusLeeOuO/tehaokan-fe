import style from "./index.module.less"
import "./index.override.less"
import LogoImage from "../../assets/images/header/header-logo.png"
import SearchIcon from "../../assets/images/header/58sousuo.svg"

import { Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom"
import HomeIcon from "../icons/homeIcon.tsx"
import LikeIcon from "../icons/likeIcon.tsx"
import HistoryIcon from "../icons/historyIcon.tsx"
import SettingsIcon from "../icons/settingsIcon.tsx"
import CloseIcon from "../icons/closeIcon.tsx"
import MaximizeIcon from "../icons/maximizeIcon.tsx"
import MinimizeIcon from "../icons/minimizeIcon.tsx"
import { lazy, Suspense, useState } from "react"
import PublicLoading from "../publicLoading"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store.ts"
import { Checkbox, Modal, Radio } from "@arco-design/web-react"
import { setConfirmOnClose, setMinimizeToTray } from "../../store/settingsSlice.ts"

const Movies = lazy(() => import("../../views/movies"))
const Recommend = lazy(() => import("../../views/recommend"))
const Series = lazy(() => import("../../views/series"))
const Subscription = lazy(() => import("../../views/subscription"))
const Favourites = lazy(() => import("../../views/favourites"))
const History = lazy(() => import("../../views/history"))
const Settings = lazy(() => import("../../views/settings"))

const RadioGroup = Radio.Group

export default function Layout() {
  const dispatch = useDispatch()
  // 从 Redux state 读取 minimizeToTray 设置
  const minimizeToTray = useSelector((state: RootState) => state.settings.minimizeToTray)
  const confirmOnClose = useSelector((state: RootState) => state.settings.confirmOnClose)

  const [visibleCloseModal, setVisibleCloseModal] = useState(false)
  const handleExitSettingsChange = (value: string) => {
    // 根据选中的值更新 minimizeToTray 设置
    dispatch(setMinimizeToTray(value === "minimize"))
  }
  const handleExitConfirmOnCloseChange = (value: boolean) => {
    dispatch(setConfirmOnClose(value))
  }

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

  // 首页按钮active类
  const currentPath = location.pathname

  // 定义应该激活首页链接的路由列表
  const homeActiveRoutes = [
    "/index/recommend",
    "/index/movies",
    "/index/series",
    "/index/subscription"
  ]

  // 检查当前路由是否应该激活首页链接
  const isHomeActive = homeActiveRoutes.includes(currentPath) || currentPath === "/"

  return (
    <>
      <div className={style.layout}>
        <nav>
          <div className={style.navItems}>
            <NavLink
              to="/"
              className={isHomeActive ? `${style.navItem} ${style.navItemActive}` : style.navItem}
            >
              <div className={style.navImg}>
                <HomeIcon />
              </div>
              <span>首页</span>
            </NavLink>
            <NavLink
              to="/favourites"
              className={({ isActive }) => isActive ? `${style.navItem} ${style.navItemActive}` : style.navItem}
            >
              <div className={style.navImg}>
                <LikeIcon />
              </div>
              <span>收藏</span>
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) => isActive ? `${style.navItem} ${style.navItemActive}` : style.navItem}
            >
              <div className={style.navImg}>
                <HistoryIcon />
              </div>
              <span>历史</span>
            </NavLink>
          </div>
          <div className={style.sectionItems}>
            <div className={style.sectionItem}>
              <NavLink to="/settings"
                       className={({ isActive }) => isActive ? `${style.sectionImg} ${style.sectionImgActive}` : `${style.sectionImg}`}>
                <SettingsIcon />
              </NavLink>
            </div>
          </div>
        </nav>
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
      <Modal
        title="点击关闭按钮后："
        visible={visibleCloseModal}
        simple={true}
        closable={true}
        onOk={conformCloseCallBack}
        onCancel={() => setVisibleCloseModal(false)}
        className="exitModal"
      >
        {/*<div>点击关闭按钮后：</div>*/}
        <div>
          <RadioGroup
            direction="vertical"
            value={minimizeToTray ? "minimize" : "exit"}
            onChange={(value) => {
              handleExitSettingsChange(value)
            }}
            className={style.radioStyle}
          >
            <Radio value="minimize">最小化到系统托盘</Radio>
            <Radio value="exit">退出程序</Radio>
          </RadioGroup>
        </div>
        <div>
          <Checkbox
            checked={confirmOnClose}
            onChange={(checked: boolean) => {
              handleExitConfirmOnCloseChange(checked)
            }}
          >关闭前提示</Checkbox>
        </div>
      </Modal>
    </>
  )
}