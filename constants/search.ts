import type { PropertyTypeValue } from '@/types/search';

export type MenuSection = {
  title: string;
  items: string[];
};

export const SEARCH_PROPERTY_TYPES: { label: string; value: PropertyTypeValue }[] = [
  { label: 'Houses', value: 'HOUSE' },
  { label: 'Apartments', value: 'APARTMENT' },
  { label: 'Commercial spaces', value: 'COMMERCIAL_SPACE' },
  { label: 'Land', value: 'LAND' },
  { label: 'Parking spots', value: 'PARKING_SPACE' },
  { label: 'Garages', value: 'GARAGE' },
];

export const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Buy',
    items: ['Homes', 'Apartments', 'Commercial Space', 'Land', 'Parking spots', 'Garages'],
  },
  {
    title: 'Rent',
    items: ['Homes', 'Apartments', 'Commercial Space', 'Land', 'Parking spots', 'Garages'],
  },
  {
    title: 'Get mortgage',
    items: [],
  },
  {
    title: 'Partners',
    items: ['Brokers', 'Construction companies'],
  },
];
