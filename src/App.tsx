import "@arco-design/web-react/dist/css/arco.css"
import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import PublicLoading from "./components/publicLoading"

const Player = lazy(() => import("./views/player"))
const Layout = lazy(() => import("./components/layout"))


function App() {
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
