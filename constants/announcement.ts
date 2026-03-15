import type { TFunction } from 'i18next';

import type { SelectOption } from '@/components/ui/select';
import { CharacteristicConfig, RentForApartmentsForm } from '@/types/announcement';

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
  { label: '4+', value: '4' },
];

export const BEDROOMS_OPTIONS: SelectOption<string>[] = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4+', value: '4' },
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

export const getPetItemsConfig = (t: TFunction): {
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

export const getObjectCharacteristics = (t: TFunction): CharacteristicConfig[] => [
  {
    iconKey: 'floors',
    label: t('announcement.rent.floors'),
    getValue: (fd) => {
      const b = fd.property?.attributes?.building;
      return b?.floorNo != null && b?.numberOfFloors != null
        ? `${b.floorNo} of ${b.numberOfFloors}`
        : '—';
    },
  },
  {
    iconKey: 'area',
    label: t('announcement.rent.area'),
    getValue: (fd) => (fd.property?.areaM2 != null ? String(fd.property.areaM2) : '—'),
  },
  {
    iconKey: 'bedroom',
    label: t('announcement.rent.bedroom'),
    getValue: (fd) =>
      fd.property?.attributes?.bedroomCount != null
        ? String(fd.property.attributes.bedroomCount)
        : '—',
  },
  {
    iconKey: 'bathroom',
    label: t('announcement.rent.bathroom'),
    getValue: (fd) =>
      fd.property?.attributes?.bathroomCount != null
        ? String(fd.property.attributes.bathroomCount)
        : '—',
  },
  {
    iconKey: 'condition',
    label: t('announcement.rent.condition'),
    getValue: (_, h) => h.conditionLabel,
  },
  {
    iconKey: 'buildingType',
    label: t('announcement.rent.building_type'),
    getValue: (_, h) => h.buildingTypeLabel,
  },
  {
    iconKey: 'yearBuilt',
    label: t('announcement.rent.year_built'),
    getValue: (fd) =>
      fd.property?.attributes?.building?.yearBuilt != null
        ? String(fd.property.attributes.building.yearBuilt)
        : '—',
  },
  {
    iconKey: 'ownershipType',
    label: t('announcement.rent.ownership_type'),
    getValue: (_, h) => h.ownershipLabel,
  },
  {
    iconKey: 'offStreetParking',
    label: t('announcement.rent.off_street_parking'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.offStreetParking),
  },
  {
    iconKey: 'attachedGarage',
    label: t('announcement.rent.attached_garage'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.attachedGarage),
  },
  {
    iconKey: 'detachedGarage',
    label: t('announcement.rent.detached_garage'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.detachedGarage),
  },
  {
    iconKey: 'washerAndLaundry',
    label: t('announcement.rent.washer_and_laundry'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.washerLaundry),
  },
  {
    iconKey: 'disabledAccess',
    label: t('announcement.rent.disabled_access'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.disabledAccess),
  },
  {
    iconKey: 'bicycleStorage',
    label: t('announcement.rent.bicycle_storage'),
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.bicycleStorage),
  },
];

export const ANNOUNCEMENT_ROUTES = {
  RENT_BASIC_INFO: {
    name: 'basic-info',
    labelKey: 'announcement.steps.list',
    completedStep: 1,
    path: '/announcement/rent/basic-info',
  },
  RENT_BROKER_LIST: {
    name: 'broker-list',
    labelKey: 'announcement.steps.list',
    completedStep: 1,
    path: '/announcement/rent/broker-list',
  },
  RENT_ANNOUNCEMENT_TITLE: {
    name: 'announcement-title',
    labelKey: 'announcement.steps.announcement_title',
    completedStep: 2,
    path: '/announcement/rent/announcement-title',
  },
  RENT_PROPERTY_INFO_FIRST: {
    name: 'property-info-first',
    labelKey: 'announcement.steps.property_info_1',
    completedStep: 3,
    path: '/announcement/rent/property-info-first',
  },
  RENT_PROPERTY_INFO_SECOND: {
    name: 'property-info-second',
    labelKey: 'announcement.steps.property_info_2',
    completedStep: 3,
    path: '/announcement/rent/property-info-second',
  },
  RENT_RENT_DETAILS: {
    name: 'rent-details',
    labelKey: 'announcement.steps.rent_details',
    completedStep: 4,
    path: '/announcement/rent/rent-details',
  },
  RENT_MEDIA: {
    name: 'media',
    labelKey: 'announcement.steps.media',
    completedStep: 5,
    path: '/announcement/rent/media',
  },
  RENT_CHARACTERISTICS: {
    name: 'characteristics',
    labelKey: 'announcement.steps.characteristics',
    completedStep: 6,
    path: '/announcement/rent/characteristics',
  },
  RENT_FINAL: {
    name: 'final',
    labelKey: 'announcement.steps.review_and_publish',
    completedStep: 7,
    path: '/announcement/rent/final',
  },
} as const;
