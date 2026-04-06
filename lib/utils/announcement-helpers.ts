import { Announcement, PropertyType } from '@/types/api';
import type { ImageSource } from 'expo-image';

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

export type CardAttribute = {
  icon: ImageSource;
  label: string;
};

/**
 * Returns the 3 card attributes based on property type per FR.MA.01.05.
 */
export function getCardAttributes(item: Announcement): CardAttribute[] {
  const attrs = (item.property?.attributes ?? {}) as Record<string, unknown>;
  const area = item.property?.areaM2;

  switch (item.propertyType) {
    case PropertyType.apartment: {
      const bedrooms = attrs.bedroomCount;
      const floorNo = attrs.floorNo;
      const totalFloors = attrs.numberOfFloors;
      const floorLabel =
        floorNo != null && totalFloors != null
          ? `${floorNo} / ${totalFloors} F`
          : floorNo != null
            ? `${floorNo} F`
            : '';
      return [
        {
          icon: require('@/assets/images/announcement-icons/size-icon.svg'),
          label: area ? `${area}m²` : '',
        },
        {
          icon: require('@/assets/images/announcement-icons/bed-icon.svg'),
          label: bedrooms ? `Bed ${bedrooms}` : '',
        },
        { icon: require('@/assets/images/announcement-icons/floors-icon.svg'), label: floorLabel },
      ];
    }
    case PropertyType.house: {
      const landArea = attrs.landAreaM2;
      const floors = attrs.numberOfFloors;
      return [
        {
          icon: require('@/assets/images/announcement-icons/size-icon.svg'),
          label: area ? `${area}m²` : '',
        },
        {
          icon: require('@/assets/images/announcement-icons/size-icon.svg'),
          label: landArea ? `${landArea}m²` : '',
        },
        {
          icon: require('@/assets/images/announcement-icons/floors-icon.svg'),
          label: floors ? `${floors} F` : '',
        },
      ];
    }
    case PropertyType.garage: {
      const spaceSize = attrs.spaceSize;
      const ceilingHeight = attrs.ceilingHeight;
      return [
        {
          icon: require('@/assets/images/announcement-icons/garage-icon.svg'),
          label: spaceSize ? `${spaceSize}` : '',
        },
        {
          icon: require('@/assets/images/announcement-icons/size-icon.svg'),
          label: area ? `${area}m²` : '',
        },
        {
          icon: require('@/assets/images/announcement-icons/floors-icon.svg'),
          label: ceilingHeight ? `${ceilingHeight}m` : '',
        },
      ];
    }
    case PropertyType.commercial_space: {
      const floor = attrs.floorNo;
      const restrooms = attrs.restroomCount;
      return [
        {
          icon: require('@/assets/images/announcement-icons/size-icon.svg'),
          label: area ? `${area}m²` : '',
        },
        {
          icon: require('@/assets/images/announcement-icons/floors-icon.svg'),
          label: floor ? `${floor} F` : '',
        },
        {
          icon: require('@/assets/images/announcement-icons/bath-icon.svg'),
          label: restrooms ? `WC ${restrooms}` : '',
        },
      ];
    }
    case PropertyType.land: {
      const waterSupply = attrs.waterSupply;
      const internet = attrs.internetAvailable;
      return [
        {
          icon: require('@/assets/images/announcement-icons/size-icon.svg'),
          label: area ? `${area}m²` : '',
        },
        {
          icon: require('@/assets/images/announcement-icons/condition-icon.svg'),
          label: waterSupply ? `${waterSupply}` : '',
        },
        {
          icon: require('@/assets/images/announcement-icons/condition-icon.svg'),
          label: internet ? `${internet}` : '',
        },
      ];
    }
    case PropertyType.parking_space: {
      const parkingType = attrs.parkingType;
      const gatedEntry = attrs.gatedEntry;
      return [
        {
          icon: require('@/assets/images/announcement-icons/parking-icon.svg'),
          label: parkingType ? `${parkingType}` : '',
        },
        {
          icon: require('@/assets/images/announcement-icons/size-icon.svg'),
          label: area ? `${area}m²` : '',
        },
        {
          icon: require('@/assets/images/announcement-icons/parking-icon.svg'),
          label: gatedEntry ? `${gatedEntry}` : '',
        },
      ];
    }
    default:
      return [
        {
          icon: require('@/assets/images/announcement-icons/size-icon.svg'),
          label: area ? `${area}m²` : '',
        },
      ];
  }
}
