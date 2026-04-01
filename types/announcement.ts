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
  listingType: 'FOR_RENT' | 'FOR_SALE' | '';
  geo: GeoDetailsDto;
  propertyType: Property | '';
  processType: 'AS_INDIVIDUAL' | 'AS_BROKER' | '';

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
};
