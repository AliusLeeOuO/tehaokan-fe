import "@arco-design/web-react/dist/css/arco.css"
import { lazy, Suspense, useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import PublicLoading from "./components/publicLoading"
import { RootState } from "./store/store.ts"
import { useSelector } from "react-redux"

const Player = lazy(() => import("./views/player"))
const Layout = lazy(() => import("./components/layout"))


function App() {
  const fontFamily = useSelector((state: RootState) => state.settings.fontFamily)

  useEffect(() => {
    // 当字体设置更改时，更新<html>或<body>元素的字体样式
    document.body.style.fontFamily = fontFamily;
  }, [fontFamily]); // 依赖项数组中包含fontFamily，确保当它更改时重新运行效果

  return (
    <Suspense fallback={<PublicLoading />}>
      <Routes>
        <Route path="/player" element={<Player />} />
        <Route path="*" element={<Layout />} />
      </Routes>
    </Suspense>
  )
}

export default App
