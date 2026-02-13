export type RentForApartmentsForm = RentForApartmentsFormStep1 &
  RentForApartmentsFormStep2 &
  RentForApartmentsFormStep3 &
  RentForApartmentsFormStep4 &
  RentForApartmentsFormStep5 &
  RentForApartmentsFormStep6;

export type RentForApartmentsFormStep5 = {
  mediaFileIds?: string[];
};

export type RentForApartmentsFormStep1 = {
  // Step 1 - Basic Info
  listingType: string;
  address: string;
  propertyType: string;
  processAnnouncement: string;
  // Step 1 - Additional services
  needPhotographer?: boolean;
  needAssessmentExpert?: boolean;
  photographerDateTime?: string;
  assessmentExpertDateTime?: string;
};

export type RentForApartmentsFormStep2 = {
  title: string;
};

export type RentForApartmentsFormStep3 = {
  area: string;
  bedrooms: string;
  bathrooms: string;
  description: string;
};

export interface RentForApartmentsFormStep4 {
  monthlyRent: string;
  securityDeposit?: string;
}
export interface RentForApartmentsFormStep6 {
  numberOfFloors: string;
  floorNo: string;
  buildingType: string;
  // Amenities checkboxes
  hvac?: boolean;
  balcony?: boolean;
  elevator?: boolean;
  offStreetParking?: boolean;
  attachedGarage?: boolean;
  detachedGarage?: boolean;
  washerAndLaundry?: boolean;
  disabledAccess?: boolean;
  evChargingStation?: boolean;
  bicycleStorage?: boolean;
  // Condition
  condition: string; // TODO: need to change to enum later
  yearBuilt: string;
  ownershipType: string; // TODO: need to change to enum later
  // Pets allowed checkboxes
  catsAllowed?: boolean;
  smallDogsAllowed?: boolean;
  largeDogsAllowed?: boolean;
}
