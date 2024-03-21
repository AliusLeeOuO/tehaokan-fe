import "./index.less"
import homeIcon from "../../assets/images/nav/52shouye-1.svg"
import likeIcon from "../../assets/images/nav/42pingjia-1.svg"
import historyIcon from "../../assets/images/nav/43shijian.svg"
import PeronIcon from "../../assets/images/nav/53gerenzhongxin-1.svg"
import SettingsIcon from "../../assets/images/nav/4shezhi.svg"
import LogoImage from "../../assets/images/header/header-logo.png"
import SearchIcon from "../../assets/images/header/58sousuo.svg"

import CloseIcon from "../../assets/images/header/4guanbi-1.svg"
import minimizeIcon from "../../assets/images/header/2zuixiaohua-1.svg"
import maximizeIcon from "../../assets/images/header/3zuidahua-1.svg"
import { Navigate, NavLink, Route, Routes } from "react-router-dom"
import Movies from "../../views/movies"
import Recommend from "../../views/recommend"
import Series from "../../views/series"
import Subscription from "../../views/subscription"

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

  return (
    <>
      <div className="layout">
        <nav>
          <div className="nav-items">
            <div className="nav-item">
              <div className="nav-img">
                <img src={homeIcon} alt="" />
              </div>
              <span>首页</span>
            </div>
            <div className="nav-item">
              <div className="nav-img">
                <img src={likeIcon} alt="" />
              </div>
              <span>收藏</span>
            </div>
            <div className="nav-item">
              <div className="nav-img">
                <img src={historyIcon} alt="" />
              </div>
              <span>历史</span>
            </div>
          </div>
          <div className="section-items">
            <div className="section-item">
              <div className="section-img">
                <img src={PeronIcon} alt="" />
              </div>
              <div className="section-img">
                <img src={SettingsIcon} alt="" />
              </div>
            </div>
          </div>
        </nav>
        <div className="layout-right">
          <header>
            <div className="logo">
              <img src={LogoImage} alt="" />
            </div>
            <div className="selector">
              <NavLink to="/recommend"
                       className={({ isActive }) => isActive ? "selector-item selector-item-active" : "selector-item"}>
                <span>推荐</span>
              </NavLink>
              <NavLink to="/movies"
                       className={({ isActive }) => isActive ? "selector-item selector-item-active" : "selector-item"}>
                <span>电影</span>
              </NavLink>
              <NavLink to="/series"
                       className={({ isActive }) => isActive ? "selector-item selector-item-active" : "selector-item"}>
                <span>剧集</span>
              </NavLink>
              <NavLink to="/subscription"
                       className={({ isActive }) => isActive ? "selector-item selector-item-active" : "selector-item"}>
                <span>追剧</span>
              </NavLink>
            </div>
            <div className="search-item">
              <div className="search-container">
                <input type="text" placeholder="搜索" className="search-input" />
                <img src={SearchIcon} alt="" className="search-icon" />
              </div>
            </div>
            <div className="action-buttons">
              <div className="action-button" onClick={minimizeApp}>
                <img src={minimizeIcon} alt="" />
              </div>
              <div className="action-button" onClick={maximizeApp}>
                <img src={maximizeIcon} alt="" />
              </div>
              <div className="action-button" onClick={closeApp}>
                <img src={CloseIcon} alt="" />
              </div>
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/recommend" element={<Recommend />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/series" element={<Series />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/" element={<Navigate replace to="/recommend" />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  )
}