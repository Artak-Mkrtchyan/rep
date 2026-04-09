import React from 'react';
import { ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export type BrokerStat = {
  value: string;
  label: string;
};

type BrokerStatsRowProps = {
  stats: BrokerStat[];
  className?: string;
};

export const BrokerStatsRow: React.FC<BrokerStatsRowProps> = ({ stats, className }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ gap: 16 }}
    className={className}>
    {stats.map((stat, index) => (
      <React.Fragment key={index}>
        {index > 0 && <View className="w-[1px] bg-neutral-200" />}
        <View className="items-center px-2">
          <ThemedText className="text-[18px] font-bold leading-[22px] text-foreground">
            {stat.value}
          </ThemedText>
          <ThemedText className="mt-1 text-[12px] leading-[14px] text-neutral-500">
            {stat.label}
          </ThemedText>
        </View>
      </React.Fragment>
    ))}
  </ScrollView>
);
