import type { CardAttribute } from '@/lib/utils/announcement-helpers';

export type MockAgent = {
  id: string;
  name: string;
  company: string;
  rating: string;
  reviewCount: string;
  avatarUri: string;
};

export type MockConstructionCompany = {
  id: string;
  name: string;
  rating: string;
  logoUri: string;
};

export type MockFeaturedListing = {
  id: string;
  title: string;
  address: string;
  priceLabel: string;
  statusLabel: string;
  attributes: CardAttribute[];
  imageUris: string[];
};

/** Placeholder imagery (stable Unsplash IDs) — replace when API data exists */
const HOUSE_1 =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80';
const HOUSE_2 =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80';

export const MOCK_FEATURED_LISTINGS: MockFeaturedListing[] = [
  {
    id: 'mock-featured-1',
    title: 'White house villa',
    address: '974 Valencia St San Francisco, CA 94110',
    priceLabel: '$ 820,420',
    statusLabel: 'Active',
    imageUris: [HOUSE_1, HOUSE_2],
    attributes: [
      {
        icon: require('@/assets/images/announcement-icons/bed-icon.svg'),
        label: 'Bed 4',
      },
      {
        icon: require('@/assets/images/announcement-icons/bath-icon.svg'),
        label: 'Bath 3',
      },
      {
        icon: require('@/assets/images/announcement-icons/size-icon.svg'),
        label: '1,442',
      },
    ],
  },
  {
    id: 'mock-featured-2',
    title: 'White house villa',
    address: '974 Valencia St San Francisco, CA 94110',
    priceLabel: '$ 820,420',
    statusLabel: 'Active',
    imageUris: [HOUSE_2],
    attributes: [
      {
        icon: require('@/assets/images/announcement-icons/bed-icon.svg'),
        label: 'Bed 4',
      },
      {
        icon: require('@/assets/images/announcement-icons/bath-icon.svg'),
        label: 'Bath 3',
      },
      {
        icon: require('@/assets/images/announcement-icons/size-icon.svg'),
        label: '1,442',
      },
    ],
  },
];

export const MOCK_AGENTS: MockAgent[] = [
  {
    id: 'mock-agent-1',
    name: 'Matt Laricy',
    company: 'Americorp Real Estate',
    rating: '5.0',
    reviewCount: '(1024)',
    avatarUri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
  },
  {
    id: 'mock-agent-2',
    name: 'Lile Jonsan',
    company: 'Americorp Real Estate',
    rating: '5.0',
    reviewCount: '(1024)',
    avatarUri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  },
  {
    id: 'mock-agent-3',
    name: 'Devit Laricy',
    company: 'Americorp Real Estate',
    rating: '5.0',
    reviewCount: '(1024)',
    avatarUri: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&q=80',
  },
  {
    id: 'mock-agent-4',
    name: 'Matt Laricy',
    company: 'Americorp Real Estate',
    rating: '5.0',
    reviewCount: '(1024)',
    avatarUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
];

export const MOCK_CONSTRUCTION_COMPANIES: MockConstructionCompany[] = [
  {
    id: 'mock-co-1',
    name: 'Sense Development',
    rating: '4.9',
    logoUri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad4ab?w=200&q=80',
  },
  {
    id: 'mock-co-2',
    name: 'Sense Development',
    rating: '4.9',
    logoUri: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&q=80',
  },
  {
    id: 'mock-co-3',
    name: 'Sense Development',
    rating: '4.9',
    logoUri: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&q=80',
  },
  {
    id: 'mock-co-4',
    name: 'Sense Development',
    rating: '4.9',
    logoUri: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200&q=80',
  },
];
