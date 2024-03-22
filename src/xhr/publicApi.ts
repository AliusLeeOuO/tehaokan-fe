import axiosInstance from "./index.ts"
import { AxiosResponse } from "axios"

export interface ImDBResponseData {
  content: imDBResponseDataContent[]
}

export interface imDBResponseDataContent {
  id: number
  name: string
  poster_url: string
  video_url: string
}

export interface seriesResponseData {
  content: seriesResponseDataContent[]
}

export interface seriesEpisodeResponseData {
  episode_name: string
  url: string
}

export interface seriesResponseDataContent {
  episodes: seriesEpisodeResponseData[]
  id: number
  poster_url: string
  series_name: string
}

export interface recommendedResponseData {
  content: recommendedResponseDataContent[]
}

export interface recommendedResponseDataContent {
  name: string
  poster_url: string
  type: string
}


export default function usePublicApi() {
  return {
    getImDB: (): Promise<AxiosResponse<ImDBResponseData>> => axiosInstance.get("/api/imdb"),
    getSeries: (): Promise<AxiosResponse<seriesResponseData>> => axiosInstance.get("/api/imdb_tv"),
    getRecommended: (): Promise<AxiosResponse<recommendedResponseData>> => axiosInstance.get("/api/recommended")
  }
}