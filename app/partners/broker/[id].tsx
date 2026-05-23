import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View , ActivityIndicator } from 'react-native';

import { AnnouncementSmallCard } from '@/components/announcement/announcement-small-card';
import { BrokerProfileCard } from '@/components/announcement/broker-profile-card';
import { BrokerListingsSection } from '@/components/partners/broker-listings-section';
import { BrokerStatsRow } from '@/components/partners/broker-stats-row';
import type { BrokerStat } from '@/components/partners/broker-stats-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGetBrokerCompanyById, useGetIndividualBrokerById } from '@/hooks/api/use-applications';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useLocalSearchParams } from 'expo-router';

const PLACEHOLDER_DEALS = [
  {
    id: '1',
    title: 'White house villa',
    address: '974 Valencia St San Francisco, CA94110',
    bedsLabel: 'Bed 4',
    bathsLabel: 'Bath 3',
    sizeLabel: '1,442',
    priceLabel: '$ 820,420',
  },
  {
    id: '2',
    title: 'White house villa',
    address: '974 Valencia St San Francisco, CA94110',
    bedsLabel: 'Bed 4',
    bathsLabel: 'Bath 3',
    sizeLabel: '1,442',
    priceLabel: '$ 820,420',
  },
];

const PLACEHOLDER_STATS: BrokerStat[] = [
  { value: '42', label: 'Sales last 12 months' },
  { value: '124', label: 'Total sales' },
  { value: '$607K-$5.5M', label: 'Price range' },
  { value: '$1.9M', label: 'Average price' },
];

const PLACEHOLDER_BIO =
  'Tyler was born in Manhattan Beach before moving to North Carolina. Tyler began his real estate career running a top producing team on the Westside of Los Angeles. The home buying/selling process can be daunting an...';

const BIO_MAX_LENGTH = 170;

const truncateByLength = (text: string, maxLength: number, isExpanded: boolean) => {
  if (text.length <= maxLength || isExpanded) return text;
  return text.substring(0, maxLength) + '...';
};

export default function BrokerDetailsScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const { id, type } = useLocalSearchParams<{ id: string; type: 'individual' | 'company' }>();

  const isIndividual = type === 'individual';
  const individualQuery = useGetIndividualBrokerById(id, isIndividual);
  const companyQuery = useGetBrokerCompanyById(id, !isIndividual);

  const isLoading = isIndividual ? individualQuery.isLoading : companyQuery.isLoading;
  const name = isIndividual
    ? (individualQuery.data?.fullName ?? '')
    : (companyQuery.data?.name ?? '');
  const phone = isIndividual
    ? (individualQuery.data?.phoneNumber ?? '')
    : (companyQuery.data?.phoneNumber ?? '');
  const email = isIndividual
    ? (individualQuery.data?.email ?? '')
    : (companyQuery.data?.email ?? '');
  const certifiedOn = isIndividual
    ? individualQuery.data?.certifiedOn
    : companyQuery.data?.certifiedOn;
  const certifiedBy = isIndividual
    ? individualQuery.data?.certifiedBy
    : companyQuery.data?.certifiedBy;
  const yearsOfActivity = isIndividual
    ? individualQuery.data?.yearsOfActivity
    : companyQuery.data?.yearsOfActivity;

  if (isLoading) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View className="pt-6" style={horizontalStyle}>
          <BrokerProfileCard
            name={name}
            phone={phone}
            email={email}
            certifiedOn={certifiedOn}
            certifiedBy={certifiedBy}
            yearsOfActivity={yearsOfActivity}
            rating={5.0}
            reviewCount={1024}
            className="mb-6"
          />

          {/* Recent Deals */}
          <View className="mb-3 mt-1">
            <ThemedText className="text-[16px] font-bold text-foreground">
              {t('partners.recent_deals')}
            </ThemedText>
          </View>
        </View>

        <ScrollView
          className="overflow-visible pl-4"
          contentContainerStyle={{ gap: 8 }}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          horizontal>
          {PLACEHOLDER_DEALS.map((deal) => (
            <AnnouncementSmallCard
              key={deal.id}
              imageSource={require('@/assets/images/hero.png')}
              className="w-[175px]"
              title={deal.title}
              address={deal.address}
              bedsLabel={deal.bedsLabel}
              bathsLabel={deal.bathsLabel}
              sizeLabel={deal.sizeLabel}
              priceLabel={deal.priceLabel}
            />
          ))}
        </ScrollView>

        <View style={horizontalStyle}>
          {/* Stats Row */}
          <BrokerStatsRow stats={PLACEHOLDER_STATS} className="mb-6 mt-6" />

          {/* Bio Section */}
          <View className="mb-6 mt-1 gap-2">
            <ThemedText className="text-[16px] font-bold text-foreground">
              {t('partners.get_to_know', { name })}
            </ThemedText>

            <ThemedText>
              <ThemedText className="text-[14px] leading-5 text-neutral-500">
                {truncateByLength(PLACEHOLDER_BIO, BIO_MAX_LENGTH, isBioExpanded)}{' '}
              </ThemedText>

              <ThemedText
                className="text-[14px] font-semibold leading-6 text-primary"
                onPress={() => setIsBioExpanded((prev) => !prev)}>
                {isBioExpanded ? t('partners.show_less') : t('partners.show_more')}
              </ThemedText>
            </ThemedText>
          </View>

          {/* Listings & Deals Section */}
          <BrokerListingsSection className="mt-2" />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
