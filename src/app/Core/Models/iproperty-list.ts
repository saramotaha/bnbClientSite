import { IPropImage } from "./iprop-image"
import { IPropertiesAvailability } from "./iproperties-availability"
import { IPropertyReviews } from "./iproperty-reviews"

export interface IPropertyList {

  id: number
  title: string
  propertyType: string
  city: string
  country: string
  description: string
  pricePerNight: number
  maxGuests:number
  bedrooms:number
  bathrooms: number
  status: string
  createdAt: string
  hostName: string
  hostEmail: string
   latitude: number
  longitude: number
  images?: IPropImage[]
  review: number
  IsFav: boolean
  availabilityDates: IPropertiesAvailability[]
  reviews: IPropertyReviews[]
}



