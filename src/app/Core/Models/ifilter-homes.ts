export interface IFilterHomes {
    location?: string
  startDate?: string
  endDate?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
  propertyType?: string
  amenityIds?: number[]
  minRating?: number
  instantBook?: boolean
  withImagesOnly?: boolean
  category?: string
  sortBy?: string
  page?: number
  pageSize?: number
}
