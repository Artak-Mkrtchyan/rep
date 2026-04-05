import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { usePriceHistory } from '@/hooks/api/use-price-history';
import { ListingType } from '@/types/api';

const CARD_SHADOW: ViewStyle = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US');
};

type PriceHistoryProps = {
  announcementId: string;
};

export const PriceHistory: React.FC<PriceHistoryProps> = ({ announcementId }) => {
  const { t } = useTranslation();
  const { priceHistory, isLoading } = usePriceHistory(announcementId);

  if (isLoading) {
    return (
      <View className="items-center py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!priceHistory || priceHistory.length === 0) {
    return null;
  }

  const listingType = priceHistory[0]?.listingType;

  const data = priceHistory
    .map((item) => {
      if (listingType === ListingType.sale) {
        return {
          createdAt: item.createdAt,
          oldPrice: item.saleDetailsChange.price.oldValue,
          newPrice: item.saleDetailsChange.price.newValue,
        };
      } else if (listingType === ListingType.rent) {
        return {
          createdAt: item.createdAt,
          oldPrice: item.rentDetailsChange.monthlyRent.oldValue,
          newPrice: item.rentDetailsChange.monthlyRent.newValue,
        };
      }
      return null;
    })
    .filter(Boolean) as { createdAt: string; oldPrice: number; newPrice: number }[];

  if (data.length === 0) return null;

  return (
    <View className="rounded-2xl bg-white p-4" style={CARD_SHADOW}>
      <ThemedText className="mb-4 text-[20px] font-semibold text-foreground">
        {t('announcement.detail.price_history')}
      </ThemedText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: 360 }}>
          {/* Header */}
          <View className="mb-2 flex-row">
            <ThemedText className="w-[100px] text-[12px] font-semibold text-foreground">
              {t('announcement.detail.date')}
            </ThemedText>
            <ThemedText className="flex-1 text-[12px] font-semibold text-foreground">
              {t('announcement.detail.price')}
            </ThemedText>
            <ThemedText className="w-[120px] text-[12px] font-semibold text-foreground">
              {t('announcement.detail.percentage')}
            </ThemedText>
          </View>

          {/* Rows */}
          {data.map((item, index) => {
            const difference = item.newPrice - item.oldPrice;
            const percentage = Math.round((difference / item.oldPrice) * 100);
            const isPositive = difference >= 0;
            const colorClass = isPositive ? 'text-primary' : 'text-destructive';

            return (
              <View
                key={index}
                className="flex-row border-t border-[#F1F1F1] py-3"
              >
                <ThemedText className="w-[100px] text-[12px] text-muted-foreground">
                  {formatDate(item.createdAt)}
                </ThemedText>
                <View className="flex-1 flex-row items-center">
                  <ThemedText className="text-[12px] text-foreground">
                    ${formatNumber(item.oldPrice)}
                  </ThemedText>
                  <ThemedText className="mx-1 text-[12px] text-primary">
                    {'\u2192'}
                  </ThemedText>
                  <ThemedText className="text-[12px] font-semibold text-primary">
                    ${formatNumber(item.newPrice)}
                  </ThemedText>
                </View>
                <View className="w-[120px] flex-row items-center">
                  <ThemedText className={`text-[12px] ${colorClass}`}>
                    {isPositive ? '+' : '-'}${formatNumber(Math.abs(difference))}
                  </ThemedText>
                  <ThemedText className={`ml-1 text-[12px] font-semibold ${colorClass}`}>
                    {isPositive ? '+' : ''}{percentage}%
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
