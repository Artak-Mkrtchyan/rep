import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import {
  BUILDING_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  LISTING_TYPE_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
} from '@/constants/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { cn } from '@/lib/utils';

const FOOTER_APPROX_HEIGHT = 152;
const CARD_CLASS = 'rounded-[12px] bg-card p-4';
const SECTION_TITLE_CLASS = 'mb-3 text-[16px] font-semibold text-foreground';

const getLabelFromValue = (
  options: { label: string; value: string }[],
  value: string
): string => (options.find((o) => o.value === value)?.label ?? value) || '—';

export default function FinalScreen() {
  const insets = useSafeAreaInsets();
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const { resetForm } = useAnnouncementForRentFormStore();

  const footerPaddingBottom = insets.bottom > 0 ? insets.bottom : 24;
  const scrollPaddingBottom = FOOTER_APPROX_HEIGHT + footerPaddingBottom + 24;

  const listingTypeLabel = getLabelFromValue(
    LISTING_TYPE_OPTIONS,
    formData.listingType
  );
  const buildingTypeLabel = getLabelFromValue(
    BUILDING_TYPE_OPTIONS,
    formData.buildingType
  );
  const conditionLabel = getLabelFromValue(
    CONDITION_OPTIONS,
    formData.condition
  );
  const ownershipLabel = getLabelFromValue(
    OWNERSHIP_TYPE_OPTIONS,
    formData.ownershipType
  );

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

  const formatYesNo = (v: boolean | undefined) => (v ? 'Yes' : 'No');

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: scrollPaddingBottom }}
        showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6">
          {/* Image placeholder */}
          <View
            className="mb-4 aspect-[4/3] w-full overflow-hidden rounded-[12px] bg-muted"
            accessibilityLabel="Property image">
            <View className="flex-1 items-center justify-center">
              <ThemedText className="text-[14px] text-muted-foreground">
                No image
              </ThemedText>
            </View>
          </View>

          {/* Property summary card */}
          <View className={cn(CARD_CLASS, 'mb-4')}>
            <View className="mb-2 flex-row items-center justify-between">
              <View className="rounded-full bg-primary/20 px-3 py-1">
                <ThemedText className="text-[12px] font-medium text-primary">
                  Draft
                </ThemedText>
              </View>
            </View>
            <ThemedText className="mb-1 text-[12px] text-muted-foreground">
              ID: —
            </ThemedText>
            <ThemedText className="mb-1 text-[14px] text-muted-foreground">
              {listingTypeLabel}
            </ThemedText>
            <ThemedText className="mb-2 text-[20px] font-bold text-foreground">
              {formData.title || '—'}
            </ThemedText>
            <ThemedText className="text-[20px] font-bold text-primary">
              {formData.monthlyRent
                ? `$${Number(formData.monthlyRent).toLocaleString()}/month`
                : '—'}
            </ThemedText>
          </View>

          {/* Announcement information */}
          <View className={cn(CARD_CLASS, 'mb-4')}>
            <ThemedText className={SECTION_TITLE_CLASS}>
              Announcement information
            </ThemedText>
            <ThemedText className="text-[14px] text-muted-foreground">
              Placed by —
            </ThemedText>
            <ThemedText className="mt-1 text-[12px] text-muted-foreground">
              Posted — · Updated —
            </ThemedText>
          </View>

          {/* Location */}
          <View className={cn(CARD_CLASS, 'mb-4')}>
            <ThemedText className={SECTION_TITLE_CLASS}>Location</ThemedText>
            <ThemedText className="text-[14px] text-foreground">
              {formData.address || '—'}
            </ThemedText>
          </View>

          {/* Notable distances */}
          <View className={cn(CARD_CLASS, 'mb-4')}>
            <ThemedText className={SECTION_TITLE_CLASS}>
              Notable distances
            </ThemedText>
            <ThemedText className="mb-3 text-[14px] text-muted-foreground">
              —
            </ThemedText>
            <Button
              variant="secondary"
              onPress={handleViewOnMap}
              accessibilityLabel="View on map"
              style={{ borderColor: '#22c55e', borderWidth: 1 }}>
              <ThemedText className="text-[16px] font-medium text-primary">
                View on map
              </ThemedText>
            </Button>
          </View>

          {/* Description */}
          <View className={cn(CARD_CLASS, 'mb-4')}>
            <ThemedText className={SECTION_TITLE_CLASS}>Description</ThemedText>
            <ThemedText className="text-[14px] leading-5 text-foreground">
              {formData.description || '—'}
            </ThemedText>
          </View>

          {/* Object characteristics */}
          <View className={cn(CARD_CLASS, 'mb-4')}>
            <ThemedText className={SECTION_TITLE_CLASS}>
              Object characteristics
            </ThemedText>
            <View className="gap-2">
              <Row
                label="Floors"
                value={
                  formData.floorNo && formData.numberOfFloors
                    ? `${formData.floorNo} of ${formData.numberOfFloors}`
                    : '—'
                }
              />
              <Row label="Area (m²)" value={formData.area || '—'} />
              <Row label="Bedroom" value={formData.bedrooms || '—'} />
              <Row label="Bathroom" value={formData.bathrooms || '—'} />
              <Row label="Condition" value={conditionLabel} />
              <Row label="Building type" value={buildingTypeLabel} />
              <Row label="Year built" value={formData.yearBuilt || '—'} />
              <Row label="Ownership type" value={ownershipLabel} />
              <Row
                label="Off-street parking"
                value={formatYesNo(formData.offStreetParking)}
              />
              <Row
                label="Attached garage"
                value={formatYesNo(formData.attachedGarage)}
              />
              <Row
                label="Detached garage"
                value={formatYesNo(formData.detachedGarage)}
              />
              <Row
                label="Washer and laundry"
                value={formatYesNo(formData.washerAndLaundry)}
              />
              <Row
                label="Disabled access"
                value={formatYesNo(formData.disabledAccess)}
              />
              <Row
                label="Bicycle storage"
                value={formatYesNo(formData.bicycleStorage)}
              />
            </View>
          </View>

          {/* Security deposit */}
          <View className={cn(CARD_CLASS, 'mb-4')}>
            <View className="flex-row items-center justify-between">
              <ThemedText className="text-[16px] font-medium text-foreground">
                Security deposit
              </ThemedText>
              <View className="rounded-[8px] bg-primary/20 px-3 py-2">
                <ThemedText className="text-[16px] font-semibold text-primary">
                  {formData.securityDeposit
                    ? `$ ${Number(formData.securityDeposit).toLocaleString()}`
                    : '—'}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Pets allowed */}
          <View className={cn(CARD_CLASS, 'mb-4')}>
            <ThemedText className={SECTION_TITLE_CLASS}>Pets allowed</ThemedText>
            <View className="flex-row flex-wrap gap-2">
              {formData.catsAllowed ? (
                <View className="rounded-[8px] bg-muted px-3 py-2">
                  <ThemedText className="text-[14px] text-foreground">
                    Cat
                  </ThemedText>
                </View>
              ) : null}
              {formData.smallDogsAllowed ? (
                <View className="rounded-[8px] bg-muted px-3 py-2">
                  <ThemedText className="text-[14px] text-foreground">
                    Small dogs (under 40 kg)
                  </ThemedText>
                </View>
              ) : null}
              {formData.largeDogsAllowed ? (
                <View className="rounded-[8px] bg-muted px-3 py-2">
                  <ThemedText className="text-[14px] text-foreground">
                    Large dogs (over 40 kg)
                  </ThemedText>
                </View>
              ) : null}
              {!formData.catsAllowed &&
                !formData.smallDogsAllowed &&
                !formData.largeDogsAllowed && (
                  <ThemedText className="text-[14px] text-muted-foreground">
                    —
                  </ThemedText>
                )}
            </View>
          </View>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-2 border-b border-default pb-2">
      <ThemedText className="text-[14px] text-muted-foreground">{label}</ThemedText>
      <ThemedText className="text-[14px] font-medium text-foreground">
        {value}
      </ThemedText>
    </View>
  );
}
