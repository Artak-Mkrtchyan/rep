import { Image, type ImageSource } from 'expo-image';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AnnouncementCard } from '@/components/announcement/announcement-card';
import { ThemedText } from '@/components/themed-text';
import { PropertyType, type PropertyDetailsDto } from '@/types/api';

import { styles } from './object-characteristics.styles';

type CharacteristicConfig = {
  key: string;
  labelKey: string;
  icon: ImageSource;
};

function flattenAttributes(attrs: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!attrs) return {};
  const flat: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      for (const [nestedKey, nestedValue] of Object.entries(value as Record<string, unknown>)) {
        flat[nestedKey] = nestedValue;
      }
    } else {
      flat[key] = value;
    }
  }
  return flat;
}

const COMMON_CHARACTERISTICS: CharacteristicConfig[] = [
  {
    key: 'areaM2',
    labelKey: 'property_details.area',
    icon: require('@/assets/images/announcement-icons/size-icon.svg'),
  },
];

const APARTMENT_CHARACTERISTICS: CharacteristicConfig[] = [
  {
    key: 'yearBuilt',
    labelKey: 'property_details.year_built',
    icon: require('@/assets/images/announcement-icons/yearBuilt-icon.svg'),
  },
  {
    key: 'floorNo',
    labelKey: 'property_details.floors',
    icon: require('@/assets/images/announcement-icons/floors-icon.svg'),
  },
  {
    key: 'buildingType',
    labelKey: 'property_details.building_type',
    icon: require('@/assets/images/announcement-icons/buildingType-icon.svg'),
  },
  {
    key: 'bedroomCount',
    labelKey: 'property_details.bedrooms',
    icon: require('@/assets/images/announcement-icons/bed-icon.svg'),
  },
  {
    key: 'bathroomCount',
    labelKey: 'property_details.bathrooms',
    icon: require('@/assets/images/announcement-icons/bath-icon.svg'),
  },
  {
    key: 'condition',
    labelKey: 'property_details.condition',
    icon: require('@/assets/images/announcement-icons/condition-icon.svg'),
  },
  {
    key: 'ownershipType',
    labelKey: 'property_details.ownership_type',
    icon: require('@/assets/images/announcement-icons/ownershipType-icon.svg'),
  },
  {
    key: 'elevator',
    labelKey: 'property_details.elevator',
    icon: require('@/assets/images/announcement-icons/floors-icon.svg'),
  },
  {
    key: 'balcony',
    labelKey: 'property_details.balcony',
    icon: require('@/assets/images/announcement-icons/floors-icon.svg'),
  },
  {
    key: 'offStreetParking',
    labelKey: 'property_details.parking',
    icon: require('@/assets/images/announcement-icons/parking-icon.svg'),
  },
  {
    key: 'attachedGarage',
    labelKey: 'property_details.attached_garage',
    icon: require('@/assets/images/announcement-icons/garage-icon.svg'),
  },
  {
    key: 'detachedGarage',
    labelKey: 'property_details.detached_garage',
    icon: require('@/assets/images/announcement-icons/garage-icon.svg'),
  },
  {
    key: 'bicycleStorage',
    labelKey: 'property_details.bicycle_storage',
    icon: require('@/assets/images/announcement-icons/bike-icon.svg'),
  },
  {
    key: 'washerLaundry',
    labelKey: 'property_details.laundry',
    icon: require('@/assets/images/announcement-icons/washer-icon.svg'),
  },
  {
    key: 'disabledAccess',
    labelKey: 'property_details.disabled_access',
    icon: require('@/assets/images/announcement-icons/disabledAccess-icon.svg'),
  },
  {
    key: 'hvac',
    labelKey: 'property_details.hvac',
    icon: require('@/assets/images/announcement-icons/condition-icon.svg'),
  },
  {
    key: 'evChargingStation',
    labelKey: 'property_details.ev_charging',
    icon: require('@/assets/images/announcement-icons/parking-icon.svg'),
  },
];

const HOUSE_CHARACTERISTICS: CharacteristicConfig[] = [
  {
    key: 'yearBuilt',
    labelKey: 'property_details.year_built',
    icon: require('@/assets/images/announcement-icons/yearBuilt-icon.svg'),
  },
  {
    key: 'numberOfFloors',
    labelKey: 'property_details.floors',
    icon: require('@/assets/images/announcement-icons/floors-icon.svg'),
  },
  {
    key: 'bedroomCount',
    labelKey: 'property_details.bedrooms',
    icon: require('@/assets/images/announcement-icons/bed-icon.svg'),
  },
  {
    key: 'bathroomCount',
    labelKey: 'property_details.bathrooms',
    icon: require('@/assets/images/announcement-icons/bath-icon.svg'),
  },
  {
    key: 'condition',
    labelKey: 'property_details.condition',
    icon: require('@/assets/images/announcement-icons/condition-icon.svg'),
  },
  {
    key: 'ownershipType',
    labelKey: 'property_details.ownership_type',
    icon: require('@/assets/images/announcement-icons/ownershipType-icon.svg'),
  },
  {
    key: 'offStreetParking',
    labelKey: 'property_details.parking',
    icon: require('@/assets/images/announcement-icons/parking-icon.svg'),
  },
  {
    key: 'attachedGarage',
    labelKey: 'property_details.attached_garage',
    icon: require('@/assets/images/announcement-icons/garage-icon.svg'),
  },
  {
    key: 'detachedGarage',
    labelKey: 'property_details.detached_garage',
    icon: require('@/assets/images/announcement-icons/garage-icon.svg'),
  },
  {
    key: 'hvac',
    labelKey: 'property_details.hvac',
    icon: require('@/assets/images/announcement-icons/condition-icon.svg'),
  },
];

const LAND_CHARACTERISTICS: CharacteristicConfig[] = [
  {
    key: 'landType',
    labelKey: 'property_details.land_type',
    icon: require('@/assets/images/announcement-icons/size-icon.svg'),
  },
  {
    key: 'permittedUse',
    labelKey: 'property_details.permitted_use',
    icon: require('@/assets/images/announcement-icons/size-icon.svg'),
  },
  {
    key: 'roadAccess',
    labelKey: 'property_details.road_access',
    icon: require('@/assets/images/announcement-icons/parking-icon.svg'),
  },
];

const COMMERCIAL_CHARACTERISTICS: CharacteristicConfig[] = [
  {
    key: 'buildingType',
    labelKey: 'property_details.building_type',
    icon: require('@/assets/images/announcement-icons/buildingType-icon.svg'),
  },
  {
    key: 'condition',
    labelKey: 'property_details.condition',
    icon: require('@/assets/images/announcement-icons/condition-icon.svg'),
  },
  {
    key: 'elevator',
    labelKey: 'property_details.elevator',
    icon: require('@/assets/images/announcement-icons/floors-icon.svg'),
  },
  {
    key: 'hvac',
    labelKey: 'property_details.hvac',
    icon: require('@/assets/images/announcement-icons/condition-icon.svg'),
  },
];

const GARAGE_CHARACTERISTICS: CharacteristicConfig[] = [
  {
    key: 'garageType',
    labelKey: 'property_details.garage_type',
    icon: require('@/assets/images/announcement-icons/garage-icon.svg'),
  },
  {
    key: 'spaceSize',
    labelKey: 'property_details.space_size',
    icon: require('@/assets/images/announcement-icons/size-icon.svg'),
  },
];

const PARKING_CHARACTERISTICS: CharacteristicConfig[] = [
  {
    key: 'parkingType',
    labelKey: 'property_details.parking_type',
    icon: require('@/assets/images/announcement-icons/parking-icon.svg'),
  },
  {
    key: 'spaceSize',
    labelKey: 'property_details.space_size',
    icon: require('@/assets/images/announcement-icons/size-icon.svg'),
  },
];

const CHARACTERISTICS_BY_TYPE: Record<string, CharacteristicConfig[]> = {
  [PropertyType.apartment]: APARTMENT_CHARACTERISTICS,
  [PropertyType.house]: HOUSE_CHARACTERISTICS,
  [PropertyType.land]: LAND_CHARACTERISTICS,
  [PropertyType.commercial_space]: COMMERCIAL_CHARACTERISTICS,
  [PropertyType.garage]: GARAGE_CHARACTERISTICS,
  [PropertyType.parking_space]: PARKING_CHARACTERISTICS,
};

type ObjectCharacteristicsProps = {
  propertyType: PropertyType;
  propertyDetails: PropertyDetailsDto;
  securityDeposit?: number;
};

export const ObjectCharacteristics: React.FC<ObjectCharacteristicsProps> = ({
  propertyType,
  propertyDetails,
  securityDeposit,
}) => {
  const { t } = useTranslation();
  const attrs = propertyDetails.attributes as Record<string, unknown> | undefined;
  const flatAttrs = useMemo(() => flattenAttributes(attrs), [attrs]);

  const items = useMemo(() => {
    const typeConfig = CHARACTERISTICS_BY_TYPE[propertyType] ?? [];
    const allConfigs = [...COMMON_CHARACTERISTICS, ...typeConfig];

    return allConfigs
      .map((config) => {
        const rawValue = config.key === 'areaM2' ? propertyDetails.areaM2 : flatAttrs[config.key];
        if (rawValue == null || rawValue === '') return null;

        const displayValue =
          typeof rawValue === 'boolean'
            ? rawValue
              ? t('common.yes')
              : t('common.no')
            : String(rawValue);

        return { ...config, displayValue };
      })
      .filter(Boolean) as (CharacteristicConfig & { displayValue: string })[];
  }, [propertyType, propertyDetails, flatAttrs, t]);

  if (items.length === 0 && securityDeposit == null) return null;

  return (
    <AnnouncementCard
      className="gap-[16px] rounded-[16px] border border-[#F1F1F1] p-[16px]"
      title={t('property_details.object_characteristics')}>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <CharacteristicItem
            key={item.key}
            label={t(item.labelKey)}
            value={item.displayValue}
            icon={item.icon}
            showSeparator={index % 2 === 0}
          />
        ))}
      </View>
      {securityDeposit != null && (
        <View style={styles.depositRow}>
          <ThemedText className="text-[16px] font-medium text-foreground">
            {t('announcement.rent.final.security_deposit')}
          </ThemedText>
          <View style={styles.depositIcon}>
            <Image
              source={require('@/assets/images/announcement-icons/hand-icon.svg')}
              style={styles.depositIcon}
              contentFit="contain"
            />
          </View>
          <ThemedText className="text-[20px] font-bold leading-[24px] text-main-500">
            {securityDeposit.toLocaleString()} $
          </ThemedText>
        </View>
      )}
    </AnnouncementCard>
  );
};

type CharacteristicItemProps = {
  label: string;
  value: string;
  icon: ImageSource;
  showSeparator: boolean;
};

const CharacteristicItem: React.FC<CharacteristicItemProps> = ({
  label,
  value,
  icon,
  showSeparator,
}) => (
  <View style={styles.item}>
    <View style={styles.iconContainer}>
      <Image source={icon} style={styles.icon} contentFit="contain" />
    </View>
    <View className="flex-1 gap-[4px]">
      <ThemedText className="text-[12px] text-muted-foreground">{label}</ThemedText>
      <ThemedText className="text-[14px] font-semibold leading-[17px] text-foreground">
        {value}
      </ThemedText>
    </View>
    {showSeparator && (
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
      </View>
    )}
  </View>
);
