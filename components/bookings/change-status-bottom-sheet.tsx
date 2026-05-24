import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Easing, Dimensions, Modal, Pressable, StyleSheet, View, Alert } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useCancelPhotoShootBookingByAuthor, useCompletePhotoShootBookingByAuthor } from '@/hooks/api/use-bookings';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BookingStatus } from '@/types/bookings';

export type ChangeBookingStatusBottomSheetProps = {
  visible: boolean;
  bookingId: string;
  currentStatus: BookingStatus;
  onClose: () => void;
  onStatusChanged: () => void;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

const STATUS_LABEL_KEY: Record<BookingStatus, string> = {
  [BookingStatus.COMPLETED]: 'booking.status.completed',
  [BookingStatus.CONFIRMED]: 'booking.status.confirmed',
  [BookingStatus.IN_PROGRESS]: 'booking.status.in_progress',
  [BookingStatus.PENDING_FOR_CONFIRMATION]: 'booking.status.pending_for_confirmation',
  [BookingStatus.CANCELLED]: 'booking.status.cancelled',
  [BookingStatus.DECLINED]: 'booking.status.declined',
  [BookingStatus.WORK_COMPLETED]: 'booking.status.work_completed',
};

const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED],
  [BookingStatus.WORK_COMPLETED]: [BookingStatus.COMPLETED],
  [BookingStatus.PENDING_FOR_CONFIRMATION]: [BookingStatus.CANCELLED],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: [],
  [BookingStatus.DECLINED]: [],
};

const STATUS_ICONS: Record<BookingStatus, string> = {
  [BookingStatus.COMPLETED]: 'checkmark-circle-outline',
  [BookingStatus.CANCELLED]: 'close-circle-outline',
  [BookingStatus.CONFIRMED]: 'radio-button-on-outline',
  [BookingStatus.IN_PROGRESS]: 'time-outline',
  [BookingStatus.PENDING_FOR_CONFIRMATION]: 'help-circle-outline',
  [BookingStatus.DECLINED]: 'alert-circle-outline',
  [BookingStatus.WORK_COMPLETED]: 'checkmark-done-circle-outline',
};

export const ChangeBookingStatusBottomSheet = ({
  visible,
  bookingId,
  currentStatus,
  onClose,
  onStatusChanged,
}: ChangeBookingStatusBottomSheetProps) => {
  const { t } = useTranslation();
  const toast = useToast();

  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;

  const cancelMutation = useCancelPhotoShootBookingByAuthor();
  const completeMutation = useCompletePhotoShootBookingByAuthor();
  const isPending = cancelMutation.isPending || completeMutation.isPending;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
      backdropAnim.setValue(0);
    }
  }, [visible, slideAnim, backdropAnim]);

  const nextStatuses = TRANSITIONS[currentStatus] || [];

  const handleSelectStatus = (status: BookingStatus) => {
    if (isPending) return;

    const title = status === BookingStatus.CANCELLED 
      ? t('booking.status.cancel_confirm_title') 
      : t('booking.status.complete_confirm_title');
    
    const message = status === BookingStatus.CANCELLED 
      ? t('booking.status.cancel_confirm_desc') 
      : t('booking.status.complete_confirm_desc');

    Alert.alert(
      title,
      message,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.continue'),
          style: status === BookingStatus.CANCELLED ? 'destructive' : 'default',
          onPress: () => performStatusChange(status),
        },
      ]
    );
  };

  const performStatusChange = async (status: BookingStatus) => {
    try {
      if (status === BookingStatus.CANCELLED) {
        await cancelMutation.mutateAsync(bookingId);
      } else if (status === BookingStatus.COMPLETED) {
        await completeMutation.mutateAsync(bookingId);
      }
      toast.success(
        t('booking.status.save_success_title'),
        t('booking.status.save_success_subtitle')
      );
      onStatusChanged();
      onClose();
    } catch {
      // Handled by react query mutation errors
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View className="flex-1 justify-end">
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(0,0,0,0.5)', opacity: backdropAnim },
          ]}>
          <Pressable
            style={{ flex: 1 }}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
          />
        </Animated.View>

        <Animated.View
          className="rounded-t-[24px] bg-white pb-6"
          style={{ transform: [{ translateY: slideAnim }] }}>
          {/* Header */}
          <View className="items-center px-4 pb-3 pt-4">
            <View className="w-full flex-row items-center justify-end">
              <Pressable
                onPress={onClose}
                className="h-10 w-10 items-center justify-center"
                accessibilityRole="button"
                hitSlop={8}>
                <Ionicons name="close" size={24} color="#111111" />
              </Pressable>
            </View>
            <ThemedText className="text-[18px] font-semibold text-foreground">
              {t('booking.status.change_status')}
            </ThemedText>
          </View>

          {/* Next status options */}
          <View className="mx-4 mt-2 gap-2">
            {nextStatuses.map((status) => {
              const label = t(STATUS_LABEL_KEY[status] ?? 'booking.status.pending_for_confirmation');
              const iconName = STATUS_ICONS[status] ?? 'help-circle-outline';
              const isDestructive = status === BookingStatus.CANCELLED;

              return (
                <Pressable
                  key={status}
                  onPress={() => handleSelectStatus(status)}
                  disabled={isPending}
                  className={cn(
                    'flex-row items-center gap-3 rounded-[12px] border border-neutral-100 p-4 active:bg-neutral-50',
                    isPending && 'opacity-50'
                  )}>
                  <Ionicons 
                    name={iconName as any} 
                    size={24} 
                    color={isDestructive ? '#EF4444' : '#10B981'} 
                  />
                  <View className="flex-1">
                    <ThemedText className={cn('text-[16px] font-medium', isDestructive ? 'text-red-500' : 'text-neutral-900')}>
                      {label}
                    </ThemedText>
                  </View>
                  {isPending && <ActivityIndicator size="small" color="#666" />}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
