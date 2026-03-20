import type { Announcement } from '@/types/api';
import { ListingType } from '@/types/api';

export type LocationInfo = {
  country?: string;
  city?: string;
  district?: string;
  address?: string;
};

export function mapImages(announcement: Announcement): string[] {
  return announcement.mediaFiles.map((f) => f.url).filter(Boolean);
}

export function mapLocation(announcement: Announcement): LocationInfo {
  const geo = announcement.geo;
  const locale = 'en';
  return {
    country: geo?.country?.[locale] || Object.values(geo?.country || {})[0],
    city: geo?.locality?.[locale] || Object.values(geo?.locality || {})[0],
    district: geo?.district?.[locale] || Object.values(geo?.district || {})[0],
    address: geo?.street?.[locale] || Object.values(geo?.street || {})[0],
  };
}

export function mapTypeLabel(announcement: Announcement, t: (key: string) => string): string {
  const propertyKey = `announcement.property_type.${announcement.propertyType.toLowerCase()}`;
  const listingKey =
    announcement.listingType === ListingType.rent
      ? 'property_details.for_rent'
      : 'property_details.for_sale';
  return `${t(propertyKey)} ${t(listingKey).toLowerCase()}`;
}

export function mapPets(announcement: Announcement) {
  const attrs = announcement.property?.attributes as Record<string, any> | undefined;
  const pets = attrs?.pets;
  if (!pets) return null;
  return {
    cat: !!pets.cat,
    smallDogs: !!pets.smallDogs,
    largeDogs: !!pets.largeDogs,
  };
}

export function hasLocationData(location?: LocationInfo): boolean {
  return !!(location && (location.country || location.city || location.district || location.address));
}
