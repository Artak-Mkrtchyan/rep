export type RentForApartmentsForm = { stepNumber: number } & RentForApartmentsFormStep1 &
  RentForApartmentsFormStep2 &
  RentForApartmentsFormStep3 &
  RentForApartmentsFormStep4 &
  RentForApartmentsFormStep5;

export type Property =
  | 'APARTMENT'
  | 'COMMERCIAL_SPACE'
  | 'GARAGE'
  | 'HOUSE'
  | 'LAND'
  | 'PARKING_SPACE';

export type RentForApartmentsFormStep1 = {
  listingType: 'FOR_RENT' | 'FOR_SALE' | '';
  geo: {
    country: string;
    formattedAddress: string;
    house?: string;
    latitude?: number;
    locality: string;
    longitude?: number;
    province: string;
    street: string;
  };
  propertyType: Property | '';
  processType: 'AS_INDIVIDUAL' | 'AS_BROKER' | '';
  needPhotographer?: boolean;
  needAssessmentExpert?: boolean;
};

export type RentForApartmentsFormStep2 = {
  title?: string;
};

export type RentForApartmentsFormStep3 = {
  property?: {
    areaM2: number;
    attributes?: Attributes;
    propertyType: Property;
    description?: string;
  };
  description?: string;
};

export type RentForApartmentsFormStep4 = {
  rentDetails?: {
    monthlyRent: number;
    securityDeposit: number;
  };
};

export type RentForApartmentsFormStep5 = {
  mediaFileIds?: string[];
};

export type Attributes = {
  type: Property;
  bathroomCount?: number;
  bedroomCount?: number;
  building?: {
    buildingType?: 'PANEL' | 'BRICK' | 'MONOLITH' | 'FRAME' | 'OTHER';
    floorNo?: string;
    numberOfFloors?: number;
    yearBuilt?: number;
  };
  amenities?: {
    hvac?: boolean;
    balcony?: boolean;
    elevator?: boolean;
    offStreetParking?: boolean;
    attachedGarage?: boolean;
    detachedGarage?: boolean;
    washerLaundry?: boolean;
    disabledAccess?: boolean;
    evChargingStation?: boolean;
    bicycleStorage?: boolean;
  };
  ownershipAndCondition?: {
    condition?: 'EXCELLENT' | 'RENOVATED' | 'NEEDS_RENOVATION' | 'UNDER_CONSTRUCTION';
    ownershipType?: 'FULL' | 'SHARED' | 'JOINT';
  };
  pets?: {
    cat?: boolean;
    largeDogs?: boolean;
    smallDogs?: boolean;
  };
};
