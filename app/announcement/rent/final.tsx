import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { AnnouncementCard } from '@/components/announcement/announcement-card';
import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { PlacedByItem } from '@/components/announcement/placed-by-item';
import { PropertyAnnouncementDetail } from '@/components/announcement/property-announcement-detail';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { RentForApartmentsForm } from '@/types/announcement';
import { Image } from 'expo-image';

const CHARACTERISTIC_ICONS: Record<string, string> = {
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

const PET_ITEMS_CONFIG: {
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

type CharacteristicConfig = {
  iconKey: keyof typeof CHARACTERISTIC_ICONS;
  label: string;
  getValue: (
    formData: RentForApartmentsForm,
    helpers: {
      conditionLabel: string;
      buildingTypeLabel: string;
      ownershipLabel: string;
      formatYesNo: (v: boolean | undefined) => string;
    }
  ) => string;
};

const OBJECT_CHARACTERISTICS: CharacteristicConfig[] = [
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

export default function FinalScreen() {
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const { resetForm } = useAnnouncementForRentFormStore();

  const handlePublish = () => {
    resetForm();
    router.replace('/(tabs)');
  };

  const handleSaveAndExit = () => {
    router.push('/(tabs)');
  };

  const handleViewOnMap = () => {
    // Placeholder: open map with address
  };

  const allowedPets = PET_ITEMS_CONFIG.filter((c) => c.getAllowed(formData));

  const conditionRaw = formData.property?.attributes?.ownershipAndCondition?.condition;
  const conditionLabel =
    conditionRaw === 'EXCELLENT'
      ? 'Excellent'
      : conditionRaw === 'RENOVATED'
        ? 'Renovated'
        : conditionRaw === 'NEEDS_RENOVATION'
          ? 'Needs renovation'
          : conditionRaw === 'UNDER_CONSTRUCTION'
            ? 'Under construction'
            : '—';

  const buildingTypeRaw = formData.property?.attributes?.building?.buildingType;
  const buildingTypeLabel = buildingTypeRaw
    ? buildingTypeRaw.charAt(0).toUpperCase() + buildingTypeRaw.slice(1)
    : '—';

  const ownershipRaw = formData.property?.attributes?.ownershipAndCondition?.ownershipType;
  const ownershipLabel =
    ownershipRaw === 'FULL'
      ? 'Full'
      : ownershipRaw === 'SHARED'
        ? 'Shared'
        : ownershipRaw === 'JOINT'
          ? 'Joint'
          : '—';

  const formatYesNo = (v: boolean | undefined) => (v ? 'Yes' : 'No');

  const typeLabel =
    formData.listingType === 'FOR_RENT' ? 'Apartment for rent' : 'Apartment for sale';

  const characteristicHelpers = {
    conditionLabel,
    buildingTypeLabel,
    ownershipLabel,
    formatYesNo,
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 31 }}
        showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6">
          {/* Image placeholder */}
          <View
            className="mb-4 aspect-[4/3] w-full overflow-hidden rounded-[12px] bg-muted"
            accessibilityLabel="Property image">
            <View className="flex-1 items-center justify-center">
              <ThemedText className="text-[14px] text-muted-foreground">No image</ThemedText>
            </View>
          </View>

          <PropertyAnnouncementDetail
            title={formData.title || ''}
            id="RH000230"
            typeLabel={typeLabel}
            price="$2,399,000"
            location={{
              country: 'Argentina',
              city: 'Buenos Aires',
              district: 'Buenos Aires',
              address: 'Av. Corrientes 1234',
            }}
            distances={{
              metro: '10 min',
              hospital: '10 min',
              school: '10 min',
              grocery: '10 min',
            }}
            placedBy={{
              name: 'John Doe',
            }}
            postedDate="10.02.2024"
            updatedDate="10.02.2024 10:42"
            onViewMap={handleViewOnMap}
          />

          {/* Description */}
          <View className="my-4">
            <ThemedText className="mb-3 text-[20px] font-semibold text-neutral-950">
              Description
            </ThemedText>
            <ThemedText className="text-neutaral-800 text-[14px] leading-5">
              Welcome to The Dracena Apartments, where Los Feliz living meets luxury and
              convenience. Nestled in the heart of one of Los Angeles most vibrant neighborhoods,
              our apartments offer an unparalleled blend of urban excitement and suburban
              tranquility.
            </ThemedText>
          </View>

          {/* Object characteristics + Security deposit */}
          <AnnouncementCard title="Object characteristics" className="mb-4 gap-[24px]">
            <View className="flex-row flex-wrap gap-y-4">
              {OBJECT_CHARACTERISTICS.map((config) => (
                <View key={config.iconKey} className="w-1/2 pr-2">
                  <PlacedByItem
                    icon={
                      <View className="h-[32px] w-[32px] items-center justify-center rounded-full bg-muted">
                        <Image
                          source={CHARACTERISTIC_ICONS[config.iconKey]}
                          style={{
                            width: 20,
                            height: 20,
                          }}
                          contentFit="contain"
                        />
                      </View>
                    }
                    name={config.getValue(formData, characteristicHelpers)}
                    label={config.label}
                    nameClassName="text-foreground"
                  />
                </View>
              ))}
            </View>
            <View className="mt-4 h-[56px] flex-row items-center justify-center gap-[12px] rounded-[12px] bg-muted">
              <ThemedText className="text-[16px] font-semibold text-neutral-950">
                Security deposit
              </ThemedText>
              <View className="flex-row items-center gap-2">
                <Image
                  source={require('@/assets/images/announcement-icons/hand-icon.svg')}
                  style={{
                    width: 32,
                    height: 32,
                  }}
                  contentFit="contain"
                />
                <ThemedText className="text-[20px] font-semibold text-main-500">500 $</ThemedText>
              </View>
            </View>
          </AnnouncementCard>

          {/* Pets allowed */}
          <AnnouncementCard title="Pets allowed" className="gap-[12px]">
            <View className="flex-row gap-2">
              {allowedPets.length > 0 ? (
                allowedPets.map((config) => (
                  <View
                    key={config.key}
                    className="flex-1 items-center justify-center gap-2 rounded-[8px] bg-muted px-3 py-4">
                    <Image
                      source={config.icon}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                      contentFit="contain"
                    />
                    <ThemedText className="text-center text-[14px] text-foreground">
                      {config.label}
                    </ThemedText>
                  </View>
                ))
              ) : (
                <ThemedText className="text-[14px] text-muted-foreground">—</ThemedText>
              )}
            </View>
          </AnnouncementCard>
        </View>
      </ScrollView>

      <AnnouncementFooter
        firstButtonLabel="Publish"
        secondButtonLabel="Save & exit"
        onNextPress={handlePublish}
        onSaveAndExitPress={handleSaveAndExit}
      />
    </ThemedView>
  );
}
