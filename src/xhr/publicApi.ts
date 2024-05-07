import axiosInstance from "./index.ts"
import { AxiosResponse } from "axios"
import { resourceType } from "../../electron/db-types.ts"

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
  id: number
  name: string
  poster_url: string
  type: resourceType
}

export interface getMovieInfoByIdResponse {
  id: number
  name: string
  poster_url: string
  video_url: string
}

export interface tvListItem {
  episode_name: string
  url: string
}

export interface getTvResponse {
  id: number
  series_name: string
  poster_url: string
  episodes: tvListItem[]
}

export default function usePublicApi() {
  return {
    getImDB: (): Promise<AxiosResponse<ImDBResponseData>> => axiosInstance.get("/api/imdb"),
    getSeries: (): Promise<AxiosResponse<seriesResponseData>> => axiosInstance.get("/api/imdb_tv"),
    getRecommended: (): Promise<AxiosResponse<recommendedResponseData>> => axiosInstance.get("/api/recommended"),
    getMovieInfoById: (id: number): Promise<AxiosResponse<getMovieInfoByIdResponse>> => axiosInstance.post(`/api/get_imdb`, JSON.stringify({
      id,
      type: "movie"
    })),
    getTvInfoById: (id: number): Promise<AxiosResponse<getTvResponse>> => axiosInstance.post(`/api/get_imdb`, JSON.stringify({
      id,
      type: "tv"
    }))
  }
}
