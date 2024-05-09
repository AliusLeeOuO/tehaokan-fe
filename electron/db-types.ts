export type resourceType = "movie" | "tv"

export interface FavouriteItem {
  id: number
  resourceType: resourceType
  resourceId: number
  gmtCreate: string
}

export interface HistoryItem {
  id: number
  resourceType: resourceType
  resourceId: number
  gmtCreate: string
}

export interface WatchingItem {
  id: number
  resourceId: number
  gmtCreate: string
}