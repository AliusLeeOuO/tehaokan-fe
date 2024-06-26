/// <reference types="vite-plugin-electron/electron-env" />

import { resourceType } from "./db-types.ts"

// 用于渲染进程，通过 `preload.ts` 暴露
declare global {
  interface Window {
    ipcRenderer: {
      on: (...args: Parameters<import("electron").IpcRenderer["on"]>) => void;
      off: (...args: Parameters<import("electron").IpcRenderer["off"]>) => void;
      send: (...args: Parameters<import("electron").IpcRenderer["send"]>) => void;
      invoke: (...args: Parameters<import("electron").IpcRenderer["invoke"]>) => Promise<any>;
      removeAllListeners: (...args: Parameters<import("electron").IpcRenderer["removeAllListeners"]>) => void;
      getType: () => resourceType | "";
      getResourceId: () => number;
      // 如果你暴露了更多方法，可以在这里继续添加...
    }
  }
}

