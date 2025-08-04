export interface RecommendationModel {
  preferredCity: string;
  budgetForNight: number; // Should be number, not string
  maxGuest: number;      // Should be number, not string
  propertyType: string;
}