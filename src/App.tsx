import "@arco-design/web-react/dist/css/arco.css"
import Layout from "./components/layout"
import { Route, Routes } from "react-router-dom"
import Player from "./views/player"

function App() {
  return (
    <Routes>
      <Route path="/player" element={<Player />} />
      <Route path="*" element={<Layout />} />
    </Routes>
  )
}

export default App
