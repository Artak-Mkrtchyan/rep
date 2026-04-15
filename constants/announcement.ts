import type { TFunction } from 'i18next';

import type { SelectOption } from '@/components/ui/select';
import { RentForApartmentsForm } from '@/types/announcement';

export const getListingTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('announcement.listing_type.for_rent'), value: 'FOR_RENT' },
  { label: t('announcement.listing_type.for_sale'), value: 'FOR_SALE' },
];

export const getPropertyTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('announcement.property_type.apartment'), value: 'APARTMENT' },
  { label: t('announcement.property_type.commercial_space'), value: 'COMMERCIAL_SPACE' },
  { label: t('announcement.property_type.garage'), value: 'GARAGE' },
  { label: t('announcement.property_type.house'), value: 'HOUSE' },
  { label: t('announcement.property_type.land'), value: 'LAND' },
  { label: t('announcement.property_type.parking_space'), value: 'PARKING_SPACE' },
];
export const BATHROOMS_OPTIONS: SelectOption<string>[] = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
];

export const getBuildingTypeOptionsCommercial = (t: TFunction): SelectOption<string>[] => [
  { label: t('building_options.office'), value: 'OFFICE' },
  { label: t('building_options.retail'), value: 'RETAIL' },
  { label: t('building_options.business_center'), value: 'BUSINESS_CENTER' },
  { label: t('building_options.industrial'), value: 'INDUSTRIAL' },
  { label: t('building_options.residential_building'), value: 'RESIDENTIAL_BUILDING' },
];

export const getGarageTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('garage_type.enclosed'), value: 'ENCLOSED' },
  { label: t('garage_type.open_air'), value: 'OPEN_AIR' },
  { label: t('garage_type.underground'), value: 'UNDERGROUND' },
  { label: t('garage_type.covered_carport'), value: 'COVERED_CARPORT' },
];

export const getSpaceSizeParkingOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('space_size_parking.motorcycle'), value: 'MOTORCYCLE' },
  { label: t('space_size_parking.small_car'), value: 'SMALL_CAR' },
  { label: t('space_size_parking.standard_car'), value: 'STANDARD_CAR' },
  { label: t('space_size_parking.suv'), value: 'SUV' },
  { label: t('space_size_parking.van'), value: 'VAN' },
];

export const getSpaceSizeGarageOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('space_size_garage.single'), value: 'SINGLE' },
  { label: t('space_size_garage.double'), value: 'DOUBLE' },
  { label: t('space_size_garage.triple'), value: 'TRIPLE' },
  { label: t('space_size_garage.multiple'), value: 'MULTIPLE' },
];

export const getLandTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('land_type.residential'), value: 'RESIDENTIAL' },
  { label: t('land_type.agricultural'), value: 'AGRICULTURAL' },
  { label: t('land_type.industrial'), value: 'INDUSTRIAL' },
  { label: t('land_type.commercial'), value: 'COMMERCIAL' },
  { label: t('land_type.mixed_use'), value: 'MIXED_USE' },
];

export const getParkingTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('parking_type.outdoor'), value: 'OUTDOOR' },
  { label: t('parking_type.indoor'), value: 'INDOOR' },
  { label: t('parking_type.underground'), value: 'UNDERGROUND' },
  { label: t('parking_type.covered'), value: 'COVERED' },
];

export const getPermittedUseOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('permitted_use.construction'), value: 'CONSTRUCTION' },
  { label: t('permitted_use.farming'), value: 'FARMING' },
  { label: t('permitted_use.storage'), value: 'STORAGE' },
  { label: t('permitted_use.parking'), value: 'PARKING' },
  { label: t('permitted_use.events'), value: 'EVENTS' },
  { label: t('permitted_use.gardening'), value: 'GARDENING' },
  { label: t('permitted_use.other'), value: 'OTHER' },
];
export const BEDROOMS_OPTIONS: SelectOption<string>[] = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
];

export const getProcessOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('announcement.process_type.as_individual'), value: 'AS_INDIVIDUAL' },
  { label: t('announcement.process_type.as_broker'), value: 'AS_BROKER' },
];

export const FLOORS_OPTIONS: SelectOption<string>[] = Array.from({ length: 20 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

export const getBuildingTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('building_options.panel'), value: 'PANEL' },
  { label: t('building_options.brick'), value: 'BRICK' },
  { label: t('building_options.monolith'), value: 'MONOLITH' },
  { label: t('building_options.frame'), value: 'FRAME' },
  { label: t('building_options.other'), value: 'OTHER' },
];

export const getConditionOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('condition_options.excellent'), value: 'EXCELLENT' },
  { label: t('condition_options.renovated'), value: 'RENOVATED' },
  { label: t('condition_options.needs_renovation'), value: 'NEEDS_RENOVATION' },
  { label: t('condition_options.under_construction'), value: 'UNDER_CONSTRUCTION' },
];

export const getOwnershipTypeOptions = (t: TFunction): SelectOption<string>[] => [
  { label: t('ownership_type_options.full'), value: 'full' },
  { label: t('ownership_type_options.shared'), value: 'shared' },
  { label: t('ownership_type_options.joint'), value: 'joint' },
];

const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_BUILT_OPTIONS: SelectOption<string>[] = Array.from(
  { length: CURRENT_YEAR - 1900 + 1 },
  (_, i) => {
    const year = CURRENT_YEAR - i;
    return { label: String(year), value: String(year) };
  }
);

export const CHARACTERISTIC_ICONS: Record<string, string> = {
  floors: require('@/assets/images/announcement-icons/floors-icon.svg'),
  area: require('@/assets/images/announcement-icons/size-icon.svg'),
  bedroom: require('@/assets/images/announcement-icons/bed-icon.svg'),
  bathroom: require('@/assets/images/announcement-icons/bath-icon.svg'),
  condition: require('@/assets/images/announcement-icons/condition-icon.svg'),
  buildingType: require('@/assets/images/announcement-icons/buildingType-icon.svg'),
  yearBuilt: require('@/assets/images/announcement-icons/yearBuilt-icon.svg'),
  ownershipType: require('@/assets/images/announcement-icons/ownershipType-icon.svg'),
  offStreetParking: require('@/assets/images/announcement-icons/parking-icon.svg'),
  attachedGarage: require('@/assets/images/announcement-icons/garage-icon.svg'),
  detachedGarage: require('@/assets/images/announcement-icons/garage-icon.svg'),
  washerAndLaundry: require('@/assets/images/announcement-icons/washer-icon.svg'),
  disabledAccess: require('@/assets/images/announcement-icons/disabledAccess-icon.svg'),
  bicycleStorage: require('@/assets/images/announcement-icons/bike-icon.svg'),
};

export const INFRASTRUCTURE_ICONS: Record<string, string> = {
  metro: require('@/assets/images/announcement-icons/metro-icon.svg'),
  hospital: require('@/assets/images/announcement-icons/hospital-icon.svg'),
  school: require('@/assets/images/announcement-icons/school-icon.svg'),
  supermarket: require('@/assets/images/announcement-icons/supermarket-icon.svg'),
};

export const getPetItemsConfig = (
  t: TFunction
): {
  key: string;
  icon: string;
  label: string;
  getAllowed: (formData: RentForApartmentsForm) => boolean;
}[] => [
  {
    key: 'cat',
    icon: require('@/assets/images/announcement-icons/cat-icon.svg'),
    label: t('announcement.rent.pet_cat'),
    getAllowed: (f) => !!f.property?.attributes?.pets?.cat,
  },
  {
    key: 'smallDogs',
    icon: require('@/assets/images/announcement-icons/small-dog-icon.svg'),
    label: t('announcement.rent.pet_small_dogs'),
    getAllowed: (f) => !!f.property?.attributes?.pets?.smallDogs,
  },
  {
    key: 'largeDogs',
    icon: require('@/assets/images/announcement-icons/large-dog-icon.svg'),
    label: t('announcement.rent.pet_large_dogs'),
    getAllowed: (f) => !!f.property?.attributes?.pets?.largeDogs,
  },
];

export const ANNOUNCEMENT_ROUTES = {
  RENT_BASIC_INFO: {
    name: 'basic-info',
    labelKey: 'announcement.steps.list',
    completedStep: 1,
    path: '/announcement/form/basic-info',
  },
  RENT_BROKER_LIST: {
    name: 'broker-list',
    labelKey: 'announcement.steps.list',
    completedStep: 1,
    path: '/announcement/form/broker-list',
  },
  RENT_ANNOUNCEMENT_TITLE: {
    name: 'announcement-title',
    labelKey: 'announcement.steps.announcement_title',
    completedStep: 2,
    path: '/announcement/form/announcement-title',
  },
  RENT_PROPERTY_INFO_FIRST: {
    name: 'property-info-first',
    labelKey: 'announcement.steps.property_info_1',
    completedStep: 3,
    path: '/announcement/form/property-info-first',
  },
  RENT_PROPERTY_INFO_SECOND: {
    name: 'property-info-second',
    labelKey: 'announcement.steps.property_info_2',
    completedStep: 3,
    path: '/announcement/form/property-info-second',
  },
  RENT_RENT_DETAILS: {
    name: 'rent-details',
    labelKey: 'announcement.steps.rent_details',
    completedStep: 4,
    path: '/announcement/form/rent-details',
  },
  RENT_SALE_DETAILS: {
    name: 'sale-details',
    labelKey: 'announcement.steps.sale_details',
    completedStep: 4,
    path: '/announcement/form/sale-details',
  },
  RENT_MEDIA_FIRST: {
    name: 'media-first',
    labelKey: 'announcement.steps.media_1',
    completedStep: 5,
    path: '/announcement/form/media-first',
  },
  RENT_MEDIA_SECOND: {
    name: 'media-second',
    labelKey: 'announcement.steps.media_2',
    completedStep: 5,
    path: '/announcement/form/media-second',
  },
  RENT_CHARACTERISTICS: {
    name: 'characteristics',
    labelKey: 'announcement.steps.characteristics',
    completedStep: 6,
    path: '/announcement/form/characteristics',
  },
  RENT_FINAL: {
    name: 'final',
    labelKey: 'announcement.steps.review_and_publish',
    completedStep: 7,
    path: '/announcement/form/final',
  },
} as const;
