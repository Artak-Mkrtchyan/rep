import { Announcement } from '@/types/api';

export function getImageSource(item: Announcement) {
  const url = item.mediaFiles?.[0]?.thumbnailUrl || item.mediaFiles?.[0]?.url;
  return url ? { uri: url } : require('@/assets/images/hero.png');
}

export function getAddress(item: Announcement): string {
  const geo = item.geo;
  return geo?.formattedAddress?.en || Object.values(geo?.formattedAddress || {})[0] || '';
}

export function getBedsLabel(item: Announcement): string {
  const attrs = item.property?.attributes as Record<string, unknown> | undefined;
  const count = attrs?.bedroomCount;
  return count ? `Bed ${count}` : '';
}

export function getBathsLabel(item: Announcement): string {
  const attrs = item.property?.attributes as Record<string, unknown> | undefined;
  const count = attrs?.bathroomCount;
  return count ? `Bath ${count}` : '';
}

export function getSizeLabel(item: Announcement): string {
  const area = item.property?.areaM2;
  return area ? area.toLocaleString() : '';
}

export function getPriceLabel(item: Announcement): string {
  if (item.rentDetails) {
    return `$ ${item.rentDetails.monthlyRent.toLocaleString()} / mo`;
  }
  if (item.saleDetails) {
    return `$ ${item.saleDetails.price.toLocaleString()}`;
  }
  return '';
}
