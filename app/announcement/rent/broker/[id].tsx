import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { AnnouncementSmallCard } from '@/components/announcement/announcement-small-card';
import { BrokerProfileCard } from '@/components/announcement/broker-profile-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const MOCK_BROKER = {
  avatar: require('@/assets/images/hero.png'),
  name: 'Gloria Duasa',
  phone: '+1 989 2342 22122',
  email: 'Gloria.Duasa@gmai.com',
  rating: 5.0,
  reviewCount: 1024,
  bio: `Tyler was born in Manhattan Beach before moving to North Carolina. Tyler began his real estate career running a top producing team on the Westside of Los Angeles. The home buying/selling process can be daunting and he strives to make it as smooth and enjoyable as possible for his clients.`,
};

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    imageSource: require('@/assets/images/hero.png'),
    title: 'White house villa',
    address: '974 Valencia St San Francisco, CA 94110',
    bedsLabel: 'Bed 4',
    bathsLabel: 'Bath 3',
    sizeLabel: '1,442',
    priceLabel: '$ 820,420',
  },

  {
    id: 2,
    imageSource: require('@/assets/images/hero.png'),
    title: 'White house villa',
    address: '974 Valencia St San Francisco, CA 94110',
    bedsLabel: 'Bed 4',
    bathsLabel: 'Bath 3',
    sizeLabel: '1,442',
    priceLabel: '$ 820,420',
  },
  {
    id: 3,
    imageSource: require('@/assets/images/hero.png'),
    title: 'White house villa',
    address: '974 Valencia St San Francisco, CA 94110',
    bedsLabel: 'Bed 4',
    bathsLabel: 'Bath 3',
    sizeLabel: '1,442',
    priceLabel: '$ 820,420',
  },
];

const truncateByLength = (text: string, maxLength = 100, isExpanded = false) => {
  if (text.length <= maxLength || isExpanded) return text;
  return text.substring(0, maxLength) + '...';
};

export default function BrokerDetailsScreen() {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const handleNext = () => {};

  const handleSaveAndExit = () => {};

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View className="px-4 pt-6">
          <BrokerProfileCard
            avatar={MOCK_BROKER.avatar}
            name={MOCK_BROKER.name}
            phone={MOCK_BROKER.phone}
            email={MOCK_BROKER.email}
            rating={MOCK_BROKER.rating}
            reviewCount={MOCK_BROKER.reviewCount}
            className="mb-6"
          />

          <View className="mt-1 gap-2">
            <ThemedText className="text-[16px] font-bold text-foreground">
              Get to know {MOCK_BROKER.name}
            </ThemedText>

            <ThemedText>
              <ThemedText className="text-[14px] leading-5 text-neutral-500">
                {truncateByLength(MOCK_BROKER.bio, 170, isBioExpanded)}{' '}
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
          {MOCK_ANNOUNCEMENTS.map((announcement) => (
            <AnnouncementSmallCard
              key={announcement.id}
              imageSource={announcement.imageSource}
              className="w-[175px]"
              title={announcement.title}
              address={announcement.address}
              bedsLabel={announcement.bedsLabel}
              bathsLabel={announcement.bathsLabel}
              sizeLabel={announcement.sizeLabel}
              priceLabel={announcement.priceLabel}
            />
          ))}
        </ScrollView>
      </ScrollView>

      <AnnouncementFooter
        firstButtonLabel="Select"
        secondButtonLabel="More details"
        onNextPress={() => handleNext()}
        onSaveAndExitPress={() => handleSaveAndExit()}
      />
    </ThemedView>
  );
}
