import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import style from "./index.module.less" // 根据需要调整路径
import HomeIcon from "../icons/homeIcon"
import LikeIcon from "../icons/likeIcon"
import HistoryIcon from "../icons/historyIcon"
import SettingsIcon from "../icons/settingsIcon"


const Nav: React.FC = () => {
  const location = useLocation()

  // 定义应该激活首页链接的路由列表
  const homeActiveRoutes = [
    "/index/recommend",
    "/index/movies",
    "/index/series",
    "/index/subscription"
  ]

  // 检查当前路由是否应该激活首页链接
  const isHomeActive = homeActiveRoutes.includes(location.pathname) || location.pathname === "/"

  return (
    <nav>
      <div className={style.navItems}>
        <NavLink
          to="/"
          className={isHomeActive ? `${style.navItem} ${style.navItemActive}` : style.navItem}
        >
          <div className={style.navImg}><HomeIcon /></div>
          <span>首页</span>
        </NavLink>
        <NavLink
          to="/favourites"
          className={({ isActive }) => isActive ? `${style.navItem} ${style.navItemActive}` : style.navItem}
        >
          <div className={style.navImg}><LikeIcon /></div>
          <span>收藏</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => isActive ? `${style.navItem} ${style.navItemActive}` : style.navItem}
        >
          <div className={style.navImg}><HistoryIcon /></div>
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
  )
}

export default Nav
