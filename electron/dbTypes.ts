export type resourceType = "movie" | "tv"

export interface FavouriteItem {
  id: number
  resourceType: string
  resourceId: number
  gmtCreate: string
}

export interface HistoryItem {
  id: number
  resourceType: string
  resourceId: number
  gmtCreate: string
}
