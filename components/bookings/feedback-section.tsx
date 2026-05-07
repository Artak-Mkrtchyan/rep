import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { BookingFeedback } from '@/types/bookings';

import { formatTimeWithSeconds } from './format';

interface Props {
  feedbacks: BookingFeedback[];
}

/**
 * "Assessment expert feedback" card on the booking detail screen
 * (Figma `12141:186184`). Each entry shows a green time stamp and the body.
 */
export const FeedbackSection: React.FC<Props> = ({ feedbacks }) => {
  const { t } = useTranslation();
  if (!feedbacks || feedbacks.length === 0) return null;

  return (
    <View
      className="rounded-2xl border border-neutral-50 bg-white p-4"
      style={{
        shadowColor: '#6E6E6E',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 33,
        elevation: 4,
      }}>
      <ThemedText className="text-[18px] font-semibold text-foreground">
        {t('booking.details.assessment_expert_feedback')}
      </ThemedText>
      <View className="mt-3 gap-3">
        {feedbacks.map((feedback, index) => (
          <View
            key={`${feedback.createdAt}-${index}`}
            className={`gap-1 ${index > 0 ? 'border-t border-neutral-50 pt-3' : ''}`}>
            <ThemedText className="text-[12px] font-semibold text-primary">
              {formatTimeWithSeconds(feedback.createdAt)}
            </ThemedText>
            <ThemedText className="text-[14px] leading-[22px] text-neutral-700">
              {feedback.text}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
};
