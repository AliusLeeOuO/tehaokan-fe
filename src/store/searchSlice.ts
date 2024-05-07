import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface SearchState {
  searchValue: string
}

const initialState: SearchState = {
  searchValue: ""
}

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload
    }
  }
})

export const { setSearchValue } = searchSlice.actions

export default searchSlice.reducer
