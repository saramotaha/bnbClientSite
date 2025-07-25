import { IPropImage } from "./iprop-image"
import { IPropertiesAvailability } from "./iproperties-availability"

export interface IPropertyList {

  id: number
  title: string
  description :string
  propertyType: string
  city: string
  country: string
  pricePerNight: number
  maxGuests:number
  bedrooms:number
  bathrooms: number
  status: string
  createdAt: string
  hostName: string
  hostEmail: string
  images?: IPropImage[]
  review: number
  IsFav: boolean
  availabilityDates:IPropertiesAvailability[]
}



