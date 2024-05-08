import style from "./index.module.less"
import Left from "./components/left"
import Top from "./components/top"
import { Navigate, Route, Routes } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react"
import PublicLoading from "../publicLoading"
import { useDispatch } from "react-redux"
import { setSearchValue } from "../../store/searchSlice.ts"

const Movies = lazy(() => import("../../views/movies"))
const Recommend = lazy(() => import("../../views/recommend"))
const Series = lazy(() => import("../../views/series"))
const Subscription = lazy(() => import("../../views/subscription"))
const Favourites = lazy(() => import("../../views/favourites"))
const History = lazy(() => import("../../views/history"))
const Settings = lazy(() => import("../../views/settings"))


export default function Layout() {

  // 读取搜索框的值
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSearchValue("")) // 当路由变化时，清除searchValue
  }, [location, dispatch])

  return (
    <>
      <div className={style.layout}>
        <Left />
        <div className={style.layoutRight}>
          <Top />
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
    </>
  )
}
