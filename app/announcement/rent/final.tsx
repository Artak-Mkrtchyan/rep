import { Ionicons } from '@expo/vector-icons';
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

const SECTION_TITLE_CLASS = 'mb-3 text-[16px] font-semibold text-foreground';

const CHARACTERISTIC_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  floors: 'layers-outline',
  area: 'resize-outline',
  bedroom: 'bed-outline',
  bathroom: 'water-outline',
  condition: 'snow-outline',
  buildingType: 'business-outline',
  yearBuilt: 'calendar-outline',
  ownershipType: 'key-outline',
  offStreetParking: 'car-outline',
  attachedGarage: 'car-outline',
  detachedGarage: 'car-outline',
  washerAndLaundry: 'water-outline',
  disabledAccess: 'accessibility-outline',
  bicycleStorage: 'bicycle-outline',
};

const PET_ICON_COLOR = '#6B7280';

const PET_ITEMS_CONFIG: {
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  getAllowed: (formData: RentForApartmentsForm) => boolean;
}[] = [
  { key: 'cat', icon: 'paw-outline', label: 'Cat', getAllowed: (f) => !!f.property?.attributes?.pets?.cat },
  {
    key: 'smallDogs',
    icon: 'paw-outline',
    label: 'Small dogs\n(under 40 kg)',
    getAllowed: (f) => !!f.property?.attributes?.pets?.smallDogs,
  },
  {
    key: 'largeDogs',
    icon: 'paw-outline',
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
    getValue: (fd) =>
      fd.property?.areaM2 != null ? String(fd.property.areaM2) : '—',
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
    getValue: (fd, h) =>
      h.formatYesNo(fd.property?.attributes?.amenities?.offStreetParking),
  },
  {
    iconKey: 'attachedGarage',
    label: 'Attached garage',
    getValue: (fd, h) =>
      h.formatYesNo(fd.property?.attributes?.amenities?.attachedGarage),
  },
  {
    iconKey: 'detachedGarage',
    label: 'Detached garage',
    getValue: (fd, h) =>
      h.formatYesNo(fd.property?.attributes?.amenities?.detachedGarage),
  },
  {
    iconKey: 'washerAndLaundry',
    label: 'Washer and laundry',
    getValue: (fd, h) =>
      h.formatYesNo(fd.property?.attributes?.amenities?.washerLaundry),
  },
  {
    iconKey: 'disabledAccess',
    label: 'Disabled access',
    getValue: (fd, h) =>
      h.formatYesNo(fd.property?.attributes?.amenities?.disabledAccess),
  },
  {
    iconKey: 'bicycleStorage',
    label: 'Bicycle storage',
    getValue: (fd, h) =>
      h.formatYesNo(fd.property?.attributes?.amenities?.bicycleStorage),
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
            title="White house villa"
            id="RH000230"
            typeLabel="Apartment for sale"
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
            <ThemedText className={SECTION_TITLE_CLASS}>Description</ThemedText>
            <ThemedText className="text-[14px] leading-5 text-foreground">
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
                      <View className="h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Ionicons
                          name={CHARACTERISTIC_ICONS[config.iconKey]}
                          size={16}
                          color="#6B7280"
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
            <View className="mt-4 flex-row items-center justify-center gap-[12px] rounded-[12px] bg-muted px-[16px] py-[12px]">
              <ThemedText className="text-[16px] font-semibold text-foreground">
                Security deposit
              </ThemedText>
              <View className="flex-row items-center gap-2">
                <Ionicons name="cash-outline" size={22} color="#087443" />
                <ThemedText className="text-[16px] font-semibold text-[#087443]">500 $</ThemedText>
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
                    <Ionicons
                      name={config.icon}
                      size={24}
                      color={PET_ICON_COLOR}
                      accessible
                      accessibilityLabel={config.label.replace('\n', ' ')}
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
