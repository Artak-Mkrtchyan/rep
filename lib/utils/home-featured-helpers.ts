import type { ImageSource } from 'expo-image';

import type { MockFeaturedListing } from '@/lib/mocks/home-mock-data';
import {
  getAddress,
  getCardAttributes,
  getImageSource,
  getPriceLabel,
  type CardAttribute,
} from '@/lib/utils/announcement-helpers';
import { Announcement } from '@/types/api';

export type FeaturedListingViewModel = {
  id: string;
  title: string;
  address: string;
  priceLabel: string;
  statusLabel: string;
  attributes: CardAttribute[];
  imageSources: ImageSource[];
  isFavourite: boolean;
  isForComparison: boolean;
};

function getBedBathAreaAttributes(item: Announcement): CardAttribute[] {
  const attrs = (item.property?.attributes ?? {}) as Record<string, unknown>;
  const area = item.property?.areaM2;
  const beds = attrs.bedroomCount;
  const baths = attrs.bathroomCount;
  const bedIcon = require('@/assets/images/announcement-icons/bed-icon.svg');
  const bathIcon = require('@/assets/images/announcement-icons/bath-icon.svg');
  const sizeIcon = require('@/assets/images/announcement-icons/size-icon.svg');

  const out: CardAttribute[] = [];
  if (beds != null && beds !== '') {
    out.push({ icon: bedIcon, label: `Bed ${beds}` });
  }
  if (baths != null && baths !== '') {
    out.push({ icon: bathIcon, label: `Bath ${baths}` });
  }
  if (area != null) {
    out.push({ icon: sizeIcon, label: area.toLocaleString() });
  }
  return out;
}

/**
 * Prefer bed / bath / area row to match Figma home cards; fall back to global card rules.
 */
export function getFeaturedRowAttributes(item: Announcement): CardAttribute[] {
  const primary = getBedBathAreaAttributes(item);
  if (primary.length > 0) {
    return primary;
  }
  return getCardAttributes(item).filter((a) => a.label !== '');
}

export function mediaSourcesForAnnouncement(item: Announcement): ImageSource[] {
  const files = item.mediaFiles ?? [];
  const uris = files
    .map((f) => f.thumbnailUrl || f.url)
    .filter((u): u is string => Boolean(u));
  if (uris.length === 0) {
    return [getImageSource(item)];
  }
  return uris.map((uri) => ({ uri }));
}

export function announcementToFeaturedVm(item: Announcement): FeaturedListingViewModel {
  const status =
    item.status?.name ??
    (item.archived ? 'Archived' : 'Active');
  return {
    id: item.id,
    title: item.title,
    address: getAddress(item),
    priceLabel: getPriceLabel(item),
    statusLabel: status,
    attributes: getFeaturedRowAttributes(item),
    imageSources: mediaSourcesForAnnouncement(item),
    isFavourite: item.favourite,
    isForComparison: item.forComparison,
  };
}

export function mockListingToFeaturedVm(item: MockFeaturedListing): FeaturedListingViewModel {
  return {
    id: item.id,
    title: item.title,
    address: item.address,
    priceLabel: item.priceLabel,
    statusLabel: item.statusLabel,
    attributes: item.attributes,
    imageSources: item.imageUris.map((uri) => ({ uri })),
    isFavourite: false,
    isForComparison: false,
  };
}
