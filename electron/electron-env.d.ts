/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// 用于渲染进程，通过 `preload.ts` 暴露
interface Window {
  ipcRenderer: {
    on: (...args: Parameters<import("electron").IpcRenderer["on"]>) => void;
    off: (...args: Parameters<import("electron").IpcRenderer["off"]>) => void;
    send: (...args: Parameters<import("electron").IpcRenderer["send"]>) => void;
    invoke: (...args: Parameters<import("electron").IpcRenderer["invoke"]>) => Promise<any>;
    getType: () => "movie" | "tv" | "";
    getResourceId: () => number;
    // 如果你暴露了更多方法，可以在这里继续添加...
  }
}