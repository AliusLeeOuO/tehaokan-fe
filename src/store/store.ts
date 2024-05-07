// src/store/store.ts
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import settingsReducer from "./settingsSlice"
import searchReducer from "./searchSlice"


const rootReducer = combineReducers({
  settings: settingsReducer,
  search: searchReducer
})

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["search"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)


// 定义 RootState 类型
export type RootState = ReturnType<typeof store.getState>;
