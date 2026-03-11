import type { SelectOption } from '@/components/ui/select';
import { CharacteristicConfig, RentForApartmentsForm } from '@/types/announcement';

export const LISTING_TYPE_OPTIONS: SelectOption<string>[] = [
  { label: 'For rent', value: 'FOR_RENT' },
  { label: 'For sale', value: 'FOR_SALE' },
];

export const PROPERTY_TYPE_OPTIONS: SelectOption<string>[] = [
  { label: 'Apartment', value: 'APARTMENT' },
  { label: 'Commercial space', value: 'COMMERCIAL_SPACE' },
  { label: 'Garage', value: 'GARAGE' },
  { label: 'House', value: 'HOUSE' },
  { label: 'Land', value: 'LAND' },
  { label: 'Parking space', value: 'PARKING_SPACE' },
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

export const PROCESS_OPTIONS: SelectOption<string>[] = [
  { label: 'As individual', value: 'AS_INDIVIDUAL' },
  { label: 'As broker', value: 'AS_BROKER' },
];

export const FLOORS_OPTIONS: SelectOption<string>[] = Array.from({ length: 20 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

export const BUILDING_TYPE_OPTIONS: SelectOption<string>[] = [
  { label: 'Panel', value: 'PANEL' },
  { label: 'Brick', value: 'BRICK' },
  { label: 'Monolith', value: 'MONOLITH' },
  { label: 'Frame', value: 'FRAME' },
  { label: 'Other', value: 'OTHER' },
];

export const CONDITION_OPTIONS: SelectOption<string>[] = [
  { label: 'Excellent', value: 'EXCELLENT' },
  { label: 'Renovated', value: 'RENOVATED' },
  { label: 'Needs renovation', value: 'NEEDS_RENOVATION' },
  { label: 'Under construction', value: 'UNDER_CONSTRUCTION' },
];

export const OWNERSHIP_TYPE_OPTIONS: SelectOption<string>[] = [
  { label: 'Full', value: 'full' },
  { label: 'Shared', value: 'shared' },
  { label: 'Joint', value: 'joint' },
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

export const PET_ITEMS_CONFIG: {
  key: string;
  icon: string;
  label: string;
  getAllowed: (formData: RentForApartmentsForm) => boolean;
}[] = [
  {
    key: 'cat',
    icon: require('@/assets/images/announcement-icons/cat-icon.svg'),
    label: 'Cat',
    getAllowed: (f) => !!f.property?.attributes?.pets?.cat,
  },
  {
    key: 'smallDogs',
    icon: require('@/assets/images/announcement-icons/small-dog-icon.svg'),
    label: 'Small dogs\n(under 40 kg)',
    getAllowed: (f) => !!f.property?.attributes?.pets?.smallDogs,
  },
  {
    key: 'largeDogs',
    icon: require('@/assets/images/announcement-icons/large-dog-icon.svg'),
    label: 'Large dogs\n(over 40 kg)',
    getAllowed: (f) => !!f.property?.attributes?.pets?.largeDogs,
  },
];

export const OBJECT_CHARACTERISTICS: CharacteristicConfig[] = [
  {
    iconKey: 'floors',
    label: 'Floors',
    getValue: (fd) => {
      const b = fd.property?.attributes?.building;
      return b?.floorNo != null && b?.numberOfFloors != null
        ? `${b.floorNo} of ${b.numberOfFloors}`
        : '—';
    },
  },
  {
    iconKey: 'area',
    label: 'Area (m²)',
    getValue: (fd) => (fd.property?.areaM2 != null ? String(fd.property.areaM2) : '—'),
  },
  {
    iconKey: 'bedroom',
    label: 'Bedroom',
    getValue: (fd) =>
      fd.property?.attributes?.bedroomCount != null
        ? String(fd.property.attributes.bedroomCount)
        : '—',
  },
  {
    iconKey: 'bathroom',
    label: 'Bathroom',
    getValue: (fd) =>
      fd.property?.attributes?.bathroomCount != null
        ? String(fd.property.attributes.bathroomCount)
        : '—',
  },
  {
    iconKey: 'condition',
    label: 'Condition',
    getValue: (_, h) => h.conditionLabel,
  },
  {
    iconKey: 'buildingType',
    label: 'Building type',
    getValue: (_, h) => h.buildingTypeLabel,
  },
  {
    iconKey: 'yearBuilt',
    label: 'Year built',
    getValue: (fd) =>
      fd.property?.attributes?.building?.yearBuilt != null
        ? String(fd.property.attributes.building.yearBuilt)
        : '—',
  },
  {
    iconKey: 'ownershipType',
    label: 'Ownership type',
    getValue: (_, h) => h.ownershipLabel,
  },
  {
    iconKey: 'offStreetParking',
    label: 'Off-street parking',
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.offStreetParking),
  },
  {
    iconKey: 'attachedGarage',
    label: 'Attached garage',
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.attachedGarage),
  },
  {
    iconKey: 'detachedGarage',
    label: 'Detached garage',
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.detachedGarage),
  },
  {
    iconKey: 'washerAndLaundry',
    label: 'Washer and laundry',
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.washerLaundry),
  },
  {
    iconKey: 'disabledAccess',
    label: 'Disabled access',
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.disabledAccess),
  },
  {
    iconKey: 'bicycleStorage',
    label: 'Bicycle storage',
    getValue: (fd, h) => h.formatYesNo(fd.property?.attributes?.amenities?.bicycleStorage),
  },
];

export const ANNOUNCEMENT_ROUTES = {
  RENT_BASIC_INFO: {
    name: 'basic-info',
    label: 'List',
    completedStep: 1,
    path: '/announcement/rent/basic-info',
  },
  RENT_ANNOUNCEMENT_TITLE: {
    name: 'announcement-title',
    label: 'Announcement title',
    completedStep: 2,
    path: '/announcement/rent/announcement-title',
  },
  RENT_PROPERTY_INFO_FIRST: {
    name: 'property-info-first',
    label: 'Property info(1/2)',
    completedStep: 3,
    path: '/announcement/rent/property-info-first',
  },
  RENT_PROPERTY_INFO_SECOND: {
    name: 'property-info-second',
    label: 'Property info(2/2)',
    completedStep: 3,
    path: '/announcement/rent/property-info-second',
  },
  RENT_RENT_DETAILS: {
    name: 'rent-details',
    label: 'Rent details',
    completedStep: 4,
    path: '/announcement/rent/rent-details',
  },
  RENT_MEDIA: {
    name: 'media',
    label: 'Media',
    completedStep: 5,
    path: '/announcement/rent/media',
  },
  RENT_CHARACTERISTICS: {
    name: 'characteristics',
    label: 'Characteristics',
    completedStep: 6,
    path: '/announcement/rent/characteristics',
  },
  RENT_FINAL: {
    name: 'final',
    label: 'Review and publish',
    completedStep: 7,
    path: '/announcement/rent/final',
  },
} as const;
