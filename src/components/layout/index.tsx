import style from "./index.module.less"
import PeronIcon from "../../assets/images/nav/53gerenzhongxin-1.svg"
import SettingsIcon from "../../assets/images/nav/4shezhi.svg"
import LogoImage from "../../assets/images/header/header-logo.png"
import SearchIcon from "../../assets/images/header/58sousuo.svg"

import CloseIcon from "../../assets/images/header/4guanbi-1.svg"
import minimizeIcon from "../../assets/images/header/2zuixiaohua-1.svg"
import maximizeIcon from "../../assets/images/header/3zuidahua-1.svg"
import { Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom"
import Movies from "../../views/movies"
import Recommend from "../../views/recommend"
import Series from "../../views/series"
import Subscription from "../../views/subscription"
import Favourites from "../../views/favourites"
import History from "../../views/history"
import HomeIcon from "./components/homeIcon.tsx"
import LikeIcon from "./components/likeIcon.tsx"
import HistoryIcon from "./components/historyIcon.tsx"

export default function Layout() {
  const minimizeApp = () => {
    window.ipcRenderer.send("minimize-window")
  }
  const maximizeApp = () => {
    window.ipcRenderer.send("maximize-window")
  }

  const closeApp = () => {
    window.ipcRenderer.send("close-window")
  }

  // selector 与 search-item 是否显示
  const location = useLocation()
  // 定义不显示selector的路由列表
  const hiddenRoutes = ["/favourites", "/history"]
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
              <div className={style.sectionImg}>
                <img src={PeronIcon} alt="" />
              </div>
              <div className={style.sectionImg}>
                <img src={SettingsIcon} alt="" />
              </div>
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
            {
              showSelector && (
                <div className={style.searchItem}>
                  <div className={style.searchContainer}>
                    <input type="text" placeholder="搜索你喜欢的视频" className={style.searchInput} />
                    <img src={SearchIcon} alt="" className={style.searchIcon} />
                  </div>
                </div>
              )
            }
            <div className={style.actionButtons}>
              <div className={style.actionButton} onClick={minimizeApp}>
                <img src={minimizeIcon} alt="" />
              </div>
              <div className={style.actionButton} onClick={maximizeApp}>
                <img src={maximizeIcon} alt="" />
              </div>
              <div className={style.actionButton} onClick={closeApp}>
                <img src={CloseIcon} alt="" />
              </div>
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/index/recommend" element={<Recommend />} />
              <Route path="/index/movies" element={<Movies />} />
              <Route path="/index/series" element={<Series />} />
              <Route path="/index/subscription" element={<Subscription />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/history" element={<History />} />
              <Route path="/" element={<Navigate replace to="/index/recommend" />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  )
}