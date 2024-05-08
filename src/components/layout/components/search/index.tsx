import style from "./index.module.less"
import SearchIcon from "../../../../assets/images/header/58sousuo.svg"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../../store/store.ts"
import { setSearchValue } from "../../../../store/searchSlice.ts"
import { useLocation } from "react-router-dom"

export default function Search() {
  // 读取搜索框的值
  const dispatch = useDispatch()
  const searchValue = useSelector((state: RootState) => state.search.searchValue)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchValue(e.target.value))
  }

  // 定义不显示搜索的路由列表
  const location = useLocation()
  const hiddenRoutes = ["/settings", "/favourites", "/history"]
  // 检查当前路由是否在隐藏列表中
  const showSelector = !hiddenRoutes.includes(location.pathname)

  return (
    <>
      {
        showSelector && (
          <div className={style.searchItem}>
            <div className={style.searchContainer}>
              <input
                type="text"
                spellCheck="false"
                placeholder="搜索你喜欢的视频"
                className={style.searchInput}
                value={searchValue}
                onChange={handleInputChange}
              />
              <img src={SearchIcon} alt="" className={style.searchIcon} />
            </div>
          </div>
        )
      }
    </>
  )
}
