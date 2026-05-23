import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { BrokerProfileCard } from '@/components/announcement/broker-profile-card';
import { ThemedView } from '@/components/themed-view';
import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { useGetBrokerCompanyById, useGetIndividualBrokerById } from '@/hooks/api/use-applications';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { router, useLocalSearchParams } from 'expo-router';

export default function BrokerDetailsScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const { id, type } = useLocalSearchParams<{ id: string; type: 'individual' | 'company' }>();
  const isIndividualBroker = type === 'individual';

  const setBrokerId = useAnnouncementForRentFormStore((s) => s.setBrokerId);
  const individualBrokerQuery = useGetIndividualBrokerById(id, isIndividualBroker);
  const brokerCompanyQuery = useGetBrokerCompanyById(id, !isIndividualBroker);

  const data = isIndividualBroker ? individualBrokerQuery?.data : brokerCompanyQuery?.data;
  const name = (isIndividualBroker ? (data as any)?.fullName : (data as any)?.name) ?? '';
  const avatarUrl = data?.avatarInfo?.url ?? data?.avatarInfo?.thumbnailUrl;

  const handleSelect = () => {
    setBrokerId(id);
    router.replace(ANNOUNCEMENT_ROUTES.RENT_BROKER_LIST.path);
  };

  const handleMoreDetails = () => {
    router.push({
      pathname: '/partners/broker/[id]',
      params: { id, type },
    });
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View className="pt-6" style={horizontalStyle}>
          <BrokerProfileCard
            avatar={avatarUrl}
            name={name}
            phone={data?.phoneNumber ?? ''}
            email={data?.email ?? ''}
            className="mb-6"
          />
        </View>
      </ScrollView>

      <AnnouncementFooter
        firstButtonLabel={t('common.select')}
        secondButtonLabel={t('partners.more_details')}
        onNextPress={() => handleSelect()}
        onSaveAndExitPress={() => handleMoreDetails()}
      />
    </ThemedView>
  );
}
