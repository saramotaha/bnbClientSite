export interface IAmenity {
  id: number;
  name: string;
  category: string;
  iconUrl: string;
}
export interface IpropertyAmenity {
    propertyId: number
      amenityId: number;
  amenity: IAmenity;
  createdAt: string;
}
