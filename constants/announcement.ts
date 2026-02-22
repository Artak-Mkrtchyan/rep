import type { SelectOption } from '@/components/ui/select';

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
  { label: 'Panel', value: 'panel' },
  { label: 'Brick', value: 'brick' },
  { label: 'Monolith', value: 'monolith' },
  { label: 'Frame', value: 'frame' },
  { label: 'Other', value: 'other' },
];

export const CONDITION_OPTIONS: SelectOption<string>[] = [
  { label: 'Excellent', value: 'excellent' },
  { label: 'Renovated', value: 'renovated' },
  { label: 'Needs renovation', value: 'needs_renovation' },
  { label: 'Under construction', value: 'under_construction' },
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
