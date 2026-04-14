import { CHARACTERISTIC_ICONS } from '@/constants/announcement';
import { ApplicationStatus } from '@/lib/api/applications';
import { InfrastructureObjectType } from '@/lib/api/infrastructure';
import { Language } from '@/lib/i18n/i18n';

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

export type ListingType = 'FOR_RENT' | 'FOR_SALE';

export type ProcessType = 'AS_INDIVIDUAL' | 'AS_BROKER';

export type LangFormDTO = {
  [key in Language]?: string;
};

export type GeoDetailsDto = {
  formattedAddress: LangFormDTO;
  latitude?: number;
  longitude?: number;

  country: LangFormDTO;
  locality: LangFormDTO;
  province: LangFormDTO;
  district?: LangFormDTO;
  street: LangFormDTO;
  house?: LangFormDTO;
};

export type RentForApartmentsFormStep1 = {
  listingType: ListingType | '';
  geo: GeoDetailsDto;
  propertyType: Property | '';
  processType: ProcessType | '';
  brokerAssignmentNeeded?: boolean;

  infrastructureObjects?: {
    distanceInMeters: number;
    type: InfrastructureObjectType;
  }[];
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
  saleDetails?: {
    price: number;
  };
};

export type RentForApartmentsFormStep5 = {
  mediaFileIds?: string[];
  documentIds?: string[];
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
  buildingType?: 'OFFICE' | 'RETAIL' | 'BUSINESS_CENTER' | 'INDUSTRIAL' | 'RESIDENTIAL_BUILDING';
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
  terrace?: boolean;
  gardenYard?: boolean;
  parking?: boolean;
  disabledAccess?: boolean;
  evChargingStation?: boolean;
  electricityAvailable?: boolean;
  infrastructure?: {
    electricityAvailable?: boolean;
    waterSupply?: boolean;
    gas?: boolean;
    sewage?: boolean;
    internetAvailable?: boolean;
  };
  roadAccess?: {
    roadAccess?: boolean;
    roadType?: 'ASPHALT' | 'GRAVEL' | 'DIRT_ROAD';
  };
  remoteAutomaticDoor?: boolean;
  motorcycleBicycleAllowed?: boolean;
  securityAccess?: {
    access247?: boolean;
    gatedEntry?: boolean;
    remoteControlAccess?: boolean;
    securityGuard?: boolean;
    securityCctv?: boolean;
  };
  ceilingHeightM?: number;
  vehicleRestrictions?: {
    maxVehicleHeightCm?: number;
    maxVehicleLengthCm?: number;
  };
  facilities?: {
    coolingHvac?: boolean;
    elevator?: boolean;
    heating?: boolean;
    ventilationSystem?: boolean;
    fireSafetySystem?: boolean;
    sprinklers?: boolean;
    receptionConcierge?: boolean;
    internetConnectivity?: boolean;
    serverRoom?: boolean;
    kitchenette?: boolean;
    restroomsCount?: number;
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
  usableAreaM2?: number;
  landAreaM2?: number;
  houseAreaM2?: number;
  garageType?: 'ENCLOSED' | 'OPEN_AIR' | 'UNDERGROUND' | 'COVERED_CARPORT';
  spaceSize?:
    | 'SINGLE'
    | 'DOUBLE'
    | 'TRIPLE'
    | 'MULTIPLE'
    | 'MOTORCYCLE'
    | 'SMALL_CAR'
    | 'STANDARD_CAR'
    | 'SUV'
    | 'VAN';
  landType?: 'RESIDENTIAL' | 'AGRICULTURAL' | 'INDUSTRIAL' | 'COMMERCIAL' | 'MIXED_USE';
  permittedUse?:
    | 'CONSTRUCTION'
    | 'FARMING'
    | 'STORAGE'
    | 'PARKING'
    | 'EVENTS'
    | 'GARDENING'
    | 'OTHER';
};

export type CharacteristicConfig = {
  iconKey: keyof typeof CHARACTERISTIC_ICONS;
  label: string;
  getValue: (
    formData: RentForApartmentsForm,
    helpers: {
      conditionLabel: string;
      buildingTypeLabel: string;
      ownershipLabel: string;
      formatYesNo: (v: boolean | undefined) => string;
    }
  ) => string;
};

export type MetaData = {
  response?: {
    id: string;
    publicId: string;
    status: ApplicationStatus;
    createdAt: string;
    createdBy: string;
    applicantEmail: string;
  };
  brokerId?: string;
  tempMediaFiles?: { id: string; uri: string; type?: string; name?: string }[];
};
