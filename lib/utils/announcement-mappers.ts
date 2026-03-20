import type { Announcement, InfrastructureObject } from '@/types/api';
import { ListingType } from '@/types/api';

export type LocationInfo = {
  country?: string;
  city?: string;
  province?: string;
  district?: string;
  street?: string;
  house?: string;
};

export type DistanceInfo = {
  type: string;
  distanceKm: string;
};

export function mapImages(announcement: Announcement): string[] {
  return announcement.mediaFiles.map((f) => f.url).filter(Boolean);
}

function getLangValue(field: Record<string, string> | undefined): string | undefined {
  if (!field) return undefined;
  return field.en || Object.values(field)[0] || undefined;
}

export function mapLocation(announcement: Announcement): LocationInfo {
  const geo = announcement.geo;
  return {
    country: getLangValue(geo?.country),
    city: getLangValue(geo?.locality),
    province: getLangValue(geo?.province),
    district: getLangValue(geo?.district),
    street: getLangValue(geo?.street),
    house: getLangValue(geo?.house),
  };
}

export function mapDistances(announcement: Announcement): DistanceInfo[] {
  const objects = announcement.infrastructureObjects;
  if (!objects || objects.length === 0) return [];
  return objects.map((obj: InfrastructureObject) => ({
    type: obj.type,
    distanceKm: (obj.distanceInMeters / 1000).toFixed(1),
  }));
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
  return !!(location && (location.country || location.city || location.province || location.district || location.street || location.house));
}
