import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { AnnouncementSmallCard } from '@/components/announcement/announcement-small-card';
import { BrokerProfileCard } from '@/components/announcement/broker-profile-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { useGetBrokerCompanyById, useGetIndividualBrokerById } from '@/hooks/api/use-applications';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { router, useLocalSearchParams } from 'expo-router';

const truncateByLength = (text: string, maxLength = 100, isExpanded = false) => {
  if (text.length <= maxLength || isExpanded) return text;
  return text.substring(0, maxLength) + '...';
};

export default function BrokerDetailsScreen() {
  const { horizontalStyle } = useScreenEdgePadding();
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const { id, type } = useLocalSearchParams<{ id: string; type: 'individual' | 'company' }>();
  const isIndividualBroker = type === 'individual';

  const setBrokerId = useAnnouncementForRentFormStore((s) => s.setBrokerId);
  const individualBrokerQuery = useGetIndividualBrokerById(id, isIndividualBroker);
  const brokerCompanyQuery = useGetBrokerCompanyById(id, !isIndividualBroker);

  const data = { ...individualBrokerQuery?.data, ...brokerCompanyQuery?.data };

  const handleSelect = () => {
    setBrokerId(id);
    router.replace(ANNOUNCEMENT_ROUTES.RENT_BROKER_LIST.path);
  };

  const handleMoreDetails = () => {};

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View className="pt-6" style={horizontalStyle}>
          <BrokerProfileCard
            avatar={require('@/assets/images/hero.png')}
            name={data?.fullName || data?.name || ''}
            phone={data?.phoneNumber || ''}
            email={data?.email || ''}
            rating={5.0}
            reviewCount={1024}
            className="mb-6"
          />

          <View className="mt-1 gap-2">
            <ThemedText className="text-[16px] font-bold text-foreground">
              Get to know {data?.fullName || data?.name || ''}
            </ThemedText>

            <ThemedText>
              <ThemedText className="text-[14px] leading-5 text-neutral-500">
                {truncateByLength('', 170, isBioExpanded)}{' '}
              </ThemedText>

              <ThemedText
                className="text-[14px] font-semibold leading-6 text-primary"
                onPress={() => setIsBioExpanded((prev) => !prev)}>
                {isBioExpanded ? 'Show less' : 'Show more'}
              </ThemedText>
            </ThemedText>
          </View>

          <View className="mb-3 mt-6">
            <ThemedText className="text-[16px] font-bold text-foreground">Recent Sales</ThemedText>
          </View>
        </View>
        <ScrollView
          className="overflow-visible pl-4"
          contentContainerStyle={{ gap: 8 }}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          horizontal>
          {[].map((announcement) => (
            <AnnouncementSmallCard
              key={2}
              imageSource={require('@/assets/images/hero.png')}
              className="w-[175px]"
              title={'White house villa'}
              address={'974 Valencia St San Francisco, CA 94110'}
              bedsLabel={'Bed 4'}
              bathsLabel={'Bath 3'}
              sizeLabel={'1,442'}
              priceLabel={'$ 820,420'}
            />
          ))}
        </ScrollView>
      </ScrollView>

      <AnnouncementFooter
        firstButtonLabel="Select"
        secondButtonLabel="More details"
        onNextPress={() => handleSelect()}
        onSaveAndExitPress={() => handleMoreDetails()}
      />
    </ThemedView>
  );
}
