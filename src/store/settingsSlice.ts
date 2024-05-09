// src/store/settingsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// 定义状态类型
interface SettingsState {
  minimizeToTray: boolean;
  confirmOnClose: boolean;
  fontFamily: string;
  autoPlay: boolean;
}

const initialState: SettingsState = {
  minimizeToTray: true,
  confirmOnClose: true,
  fontFamily: "HarmonyOS Sans",
  autoPlay: false
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setMinimizeToTray: (state, action: PayloadAction<boolean>) => {
      state.minimizeToTray = action.payload
    },
    setConfirmOnClose: (state, action: PayloadAction<boolean>) => {
      state.confirmOnClose = action.payload
    },
    setFontFamily: (state, action: PayloadAction<string>) => {
      state.fontFamily = action.payload
    },
    setAutoPlay: (state, action: PayloadAction<boolean>) => {
      state.autoPlay = action.payload
    }
  }
})

export const {
  setMinimizeToTray,
  setConfirmOnClose,
  setFontFamily ,
  setAutoPlay
} = settingsSlice.actions

export default settingsSlice.reducer
