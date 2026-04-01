import { Ionicons } from '@expo/vector-icons';
import { Image, type ImageSource } from 'expo-image';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { getPriceLabel } from '@/lib/utils/announcement-helpers';
import {
  hasLocationData,
  mapDistances,
  mapLocation,
  type DistanceInfo,
  type LocationInfo,
} from '@/lib/utils/announcement-mappers';
import type { Announcement, PropertyDetailsDto, PropertyType } from '@/types/api';

const CARD_WIDTH = 342;

type ComparisonDetailCardProps = {
  announcement: Announcement;
};

export const ComparisonDetailCard: React.FC<ComparisonDetailCardProps> = ({ announcement }) => {
  const { t } = useTranslation();
  const imageUrl = announcement.mediaFiles?.[0]?.url;
  const location = useMemo(() => mapLocation(announcement), [announcement]);
  const distances = useMemo(() => mapDistances(announcement), [announcement]);
  const characteristics = useMemo(
    () => buildCharacteristics(announcement.propertyType, announcement.property, t),
    [announcement, t]
  );

  return (
    <View style={cardStyles.shadowWrapper}>
      <View style={cardStyles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={cardStyles.imageWrapper}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={cardStyles.image} contentFit="cover" />
            ) : (
              <View style={[cardStyles.image, { backgroundColor: '#F1F1F1' }]} />
            )}
            <View style={cardStyles.imageOverlay} />
          </View>

          <View style={cardStyles.body}>
            <ThemedText className="text-[20px] font-bold leading-[24px] text-[#111111]">
              {announcement.title}
            </ThemedText>

            <ThemedText className="text-[20px] font-bold leading-[24px] text-[#087443]">
              {getPriceLabel(announcement)}
            </ThemedText>

            <AnnouncementInfoSection announcement={announcement} />

            <Divider />

            {hasLocationData(location) && (
              <>
                <LocationBlock location={location} />
                <Divider />
              </>
            )}

            {distances.length > 0 && (
              <>
                <DistancesBlock distances={distances} />
                <Divider />
              </>
            )}

            {characteristics.length > 0 && <CharacteristicsBlock items={characteristics} />}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const Divider = () => <View style={cardStyles.divider} />;

const AnnouncementInfoSection: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
  const { t } = useTranslation();
  const postedDate = formatDate(announcement.createdAt);

  return (
    <View style={cardStyles.section}>
      <ThemedText className="text-[14px] font-bold leading-[17px] text-[#111111]">
        {t('announcement.detail.announcement_info')}
      </ThemedText>
      <View className="flex-row items-center gap-[8px]">
        <View style={cardStyles.avatar}>
          <Ionicons name="person" size={16} color="#6B7280" />
        </View>
        <View className="flex-row items-center gap-[8px]">
          <InfoItem label={t('announcement.detail.placed_by')} value="—" valueColor="#087443" />
          <InfoItem label={t('announcement.detail.posted')} value={postedDate} />
          <InfoItem label={t('announcement.detail.updated')} value="—" />
        </View>
      </View>
    </View>
  );
};

const InfoItem: React.FC<{ label: string; value: string; valueColor?: string }> = ({
  label,
  value,
  valueColor = '#111111',
}) => (
  <View className="gap-[2px]">
    <ThemedText className="text-[10px] text-[#919191]">{label}</ThemedText>
    <ThemedText
      className="text-[12px] font-bold leading-[11px]"
      style={{ color: valueColor }}
      numberOfLines={1}>
      {value}
    </ThemedText>
  </View>
);

const LocationBlock: React.FC<{ location: LocationInfo }> = ({ location }) => {
  const { t } = useTranslation();
  const fields = [
    { label: t('announcement.detail.country'), value: location.country },
    { label: t('announcement.detail.city'), value: location.city },
    { label: t('announcement.detail.district'), value: location.district },
    { label: t('announcement.detail.street'), value: location.street || location.house },
  ].filter((f) => f.value);

  return (
    <View style={cardStyles.section}>
      <ThemedText className="text-[14px] font-bold leading-[17px] text-[#111111]">
        {t('announcement.detail.location')}
      </ThemedText>
      <View className="flex-row flex-wrap gap-x-[16px] gap-y-[16px]">
        {fields.map((f) => (
          <View key={f.label} className="gap-[4px]">
            <ThemedText className="text-[10px] text-[#919191]">{f.label}</ThemedText>
            <ThemedText className="text-[12px] font-bold leading-[11px] text-[#111111]">
              {f.value}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
};

const DISTANCE_CONFIGS: { type: string; labelKey: string; icon: ImageSource }[] = [
  {
    type: 'METRO',
    labelKey: 'announcement.detail.metro',
    icon: require('@/assets/images/announcement-icons/metro-icon.svg'),
  },
  {
    type: 'HOSPITAL',
    labelKey: 'announcement.detail.hospital',
    icon: require('@/assets/images/announcement-icons/hospital-icon.svg'),
  },
  {
    type: 'SCHOOL',
    labelKey: 'announcement.detail.school',
    icon: require('@/assets/images/announcement-icons/school-icon.svg'),
  },
  {
    type: 'SUPERMARKET',
    labelKey: 'announcement.detail.supermarket',
    icon: require('@/assets/images/announcement-icons/supermarket-icon.svg'),
  },
];

const DistancesBlock: React.FC<{ distances: DistanceInfo[] }> = ({ distances }) => {
  const { t } = useTranslation();

  return (
    <View style={cardStyles.section}>
      <ThemedText className="text-[14px] font-bold leading-[17px] text-[#111111]">
        {t('announcement.detail.notable_distances')}
      </ThemedText>
      <View className="flex-row flex-wrap" style={{ rowGap: 16, justifyContent: 'space-between' }}>
        {distances.map((d) => {
          const config = DISTANCE_CONFIGS.find((c) => c.type === d.type);
          if (!config) return null;
          return (
            <View key={d.type} style={cardStyles.distItem}>
              <View style={cardStyles.distIcon}>
                <Image
                  source={config.icon}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                />
              </View>
              <View className="gap-[4px]">
                <ThemedText className="text-[10px] text-[#919191]">{t(config.labelKey)}</ThemedText>
                <View className="flex-row items-center gap-[4px]">
                  <ThemedText className="text-[12px] font-bold leading-[11px] text-[#111111]">
                    {d.distanceKm}km
                  </ThemedText>
                  <Image
                    source={require('@/assets/images/announcement-icons/walking-icon.svg')}
                    style={{ width: 14, height: 14 }}
                    contentFit="contain"
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

type CharItem = { label: string; value: string; icon: ImageSource };

const CHAR_CONFIGS: { key: string; labelKey: string; icon: ImageSource }[] = [
  {
    key: 'areaM2',
    labelKey: 'property_details.area',
    icon: require('@/assets/images/announcement-icons/size-icon.svg'),
  },
  {
    key: 'bathroomCount',
    labelKey: 'property_details.bathrooms',
    icon: require('@/assets/images/announcement-icons/bath-icon.svg'),
  },
  {
    key: 'bedroomCount',
    labelKey: 'property_details.bedrooms',
    icon: require('@/assets/images/announcement-icons/bed-icon.svg'),
  },
  {
    key: 'buildingType',
    labelKey: 'property_details.building_type',
    icon: require('@/assets/images/announcement-icons/buildingType-icon.svg'),
  },
  {
    key: 'hvac',
    labelKey: 'property_details.hvac',
    icon: require('@/assets/images/announcement-icons/condition-icon.svg'),
  },
  {
    key: 'numberOfFloors',
    labelKey: 'property_details.floors',
    icon: require('@/assets/images/announcement-icons/floors-icon.svg'),
  },
  {
    key: 'floorNo',
    labelKey: 'property_details.floors',
    icon: require('@/assets/images/announcement-icons/floors-icon.svg'),
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
    key: 'offStreetParking',
    labelKey: 'property_details.parking',
    icon: require('@/assets/images/announcement-icons/parking-icon.svg'),
  },
];

function flattenAttributes(attrs: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!attrs) return {};
  const flat: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      for (const [nk, nv] of Object.entries(value as Record<string, unknown>)) {
        flat[nk] = nv;
      }
    } else {
      flat[key] = value;
    }
  }
  return flat;
}

function buildCharacteristics(
  _propertyType: PropertyType,
  property: PropertyDetailsDto,
  t: (key: string) => string
): CharItem[] {
  const attrs = property?.attributes as Record<string, unknown> | undefined;
  const flat = flattenAttributes(attrs);
  return CHAR_CONFIGS.map((c) => {
    const raw = c.key === 'areaM2' ? property?.areaM2 : flat[c.key];
    if (raw == null || raw === '') return null;
    const val = typeof raw === 'boolean' ? (raw ? t('common.yes') : t('common.no')) : String(raw);
    return { label: t(c.labelKey), value: val, icon: c.icon };
  }).filter(Boolean) as CharItem[];
}

const CharacteristicsBlock: React.FC<{ items: CharItem[] }> = ({ items }) => {
  const { t } = useTranslation();
  const cols = splitColumns(items, 3);

  return (
    <View style={cardStyles.section}>
      <ThemedText className="text-[14px] font-bold leading-[17px] text-[#111111]">
        {t('property_details.object_characteristics')}
      </ThemedText>
      <View className="flex-row" style={{ gap: 16 }}>
        {cols.map((col, ci) => (
          <View key={ci} style={{ gap: 16, flex: 1 }}>
            {col.map((item) => (
              <View key={item.label} className="flex-row items-center gap-[4px]">
                <View style={cardStyles.distIcon}>
                  <Image
                    source={item.icon}
                    style={{ width: 16, height: 16 }}
                    contentFit="contain"
                  />
                </View>
                <View className="gap-[2px]">
                  <ThemedText className="text-[10px] text-[#777777]">{item.label}</ThemedText>
                  <ThemedText className="text-[12px] font-semibold text-[#111111]">
                    {item.value}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

function splitColumns<T>(items: T[], numCols: number): T[][] {
  const cols: T[][] = Array.from({ length: numCols }, () => []);
  items.forEach((item, i) => cols[i % numCols].push(item));
  return cols;
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `(${dd}.${mm}.${yyyy})`;
}

export { CARD_WIDTH };

const cardStyles = StyleSheet.create({
  shadowWrapper: {
    width: CARD_WIDTH,
    borderRadius: 16,
    shadowColor: '#6E6E6E',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 33,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: 178,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  body: {
    padding: 16,
    gap: 16,
  },
  section: {
    gap: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    borderRadius: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  distItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '48%',
  },
  distIcon: {
    width: 28,
    height: 28,
    borderRadius: 66,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
