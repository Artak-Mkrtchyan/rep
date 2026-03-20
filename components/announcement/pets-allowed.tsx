import { Image, type ImageSource } from 'expo-image';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AnnouncementCard } from '@/components/announcement/announcement-card';
import { ThemedText } from '@/components/themed-text';

type PetConfig = {
  key: keyof PetsAllowedProps['pets'];
  labelKey: string;
  icon: ImageSource;
};

const PET_CONFIGS: PetConfig[] = [
  { key: 'cat', labelKey: 'property_details.pet.cat', icon: require('@/assets/images/announcement-icons/cat-icon.svg') },
  { key: 'smallDogs', labelKey: 'property_details.pet.small_dogs', icon: require('@/assets/images/announcement-icons/small-dog-icon.svg') },
  { key: 'largeDogs', labelKey: 'property_details.pet.large_dogs', icon: require('@/assets/images/announcement-icons/large-dog-icon.svg') },
];

type PetsAllowedProps = {
  pets: {
    cat?: boolean;
    smallDogs?: boolean;
    largeDogs?: boolean;
  };
};

export const PetsAllowed: React.FC<PetsAllowedProps> = ({ pets }) => {
  const { t } = useTranslation();

  const activePets = useMemo(
    () => PET_CONFIGS.filter((config) => pets[config.key]),
    [pets]
  );

  if (activePets.length === 0) return null;

  return (
    <AnnouncementCard
      className="gap-[16px] rounded-[8px] px-[16px] py-[12px]"
      title={t('property_details.pets_allowed')}>
      <View style={petStyles.row}>
        {activePets.map((config) => (
          <PetCard key={config.key} label={t(config.labelKey)} icon={config.icon} />
        ))}
      </View>
    </AnnouncementCard>
  );
};

type PetCardProps = {
  label: string;
  icon: ImageSource;
};

const PetCard: React.FC<PetCardProps> = ({ label, icon }) => (
  <View style={petStyles.card}>
    <Image source={icon} style={petStyles.icon} contentFit="contain" />
    <ThemedText className="text-center text-[12px] text-foreground">{label}</ThemedText>
  </View>
);

const petStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  card: {
    alignItems: 'center',
    gap: 4,
    width: 92,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
