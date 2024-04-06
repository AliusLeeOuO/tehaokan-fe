// src/store/settingsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// 定义状态类型
interface SettingsState {
  minimizeToTray: boolean;
  confirmOnClose: boolean;
  fontFamily: string;
}

const initialState: SettingsState = {
  minimizeToTray: true,
  confirmOnClose: true,
  fontFamily: "HarmonyOS Sans"
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
    }
  }
})

export const { setMinimizeToTray, setConfirmOnClose, setFontFamily } = settingsSlice.actions

export default settingsSlice.reducer
