import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../themed-text';
import { cn } from '@/lib/utils';

export type ApplicationCommentBannerProps = {
  status?: string;
  comment?: string;
  className?: string;
};

export const ApplicationCommentBanner: React.FC<ApplicationCommentBannerProps> = ({
  status,
  comment,
  className,
}) => {
  const { t } = useTranslation();

  if (!status || !comment) return null;

  const isReturned = status === 'RETURNED_TO_APPLICANT';
  const isRejected = status === 'REJECTED';

  if (!isReturned && !isRejected) return null;

  return (
    <View
      className={cn(
        'flex-row items-start gap-3 rounded-xl border p-4 mb-4',
        isReturned 
          ? 'bg-amber-50/90 border-amber-300/65 shadow-sm' 
          : 'bg-rose-50/90 border-rose-300/65 shadow-sm',
        className
      )}>
      <Ionicons
        name={isReturned ? 'warning-outline' : 'alert-circle-outline'}
        size={22}
        color={isReturned ? '#b45309' : '#be123c'}
        style={{ marginTop: 2 }}
      />
      <View className="flex-1 gap-1">
        <ThemedText
          className={cn(
            'text-[15px] font-bold',
            isReturned ? 'text-amber-800' : 'text-rose-800'
          )}>
          {isReturned
            ? t('add_application.application_comment.returned')
            : t('add_application.application_comment.rejected')}
        </ThemedText>
        <ThemedText
          className={cn(
            'text-[14px] leading-5 font-normal',
            isReturned ? 'text-amber-900/90' : 'text-rose-900/90'
          )}>
          {comment}
        </ThemedText>
      </View>
    </View>
  );
};
