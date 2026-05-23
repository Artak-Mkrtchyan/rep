import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Easing, Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { useCloseAnnouncement, useReopenAnnouncement } from '@/hooks/api/use-my-announcements';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ClosureReason } from '@/types/my-announcements';

export type ChangeStatusBottomSheetProps = {
  visible: boolean;
  currentStatus: string;
  announcementId: string;
  onClose: () => void;
  onStatusChanged: () => void;
  currentClosureReason?: string;
};

type StatusChoice = 'ACTIVE' | 'CLOSE';

const CLOSURE_REASONS: { value: ClosureReason; labelKey: string }[] = [
  { value: ClosureReason.GIVEN_FOR_RENT, labelKey: 'announcement.my.closure.given_for_rent' },
  { value: ClosureReason.SOLD_OUT, labelKey: 'announcement.my.closure.sold_out' },
  {
    value: ClosureReason.WITHDRAWN_FOR_OTHER_REASONS,
    labelKey: 'announcement.my.closure.withdrawn',
  },
];

const FOOTER_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const ChangeStatusBottomSheet = ({
  visible,
  currentStatus,
  announcementId,
  onClose,
  onStatusChanged,
  currentClosureReason,
}: ChangeStatusBottomSheetProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;

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

  const isCurrentlyActive = currentStatus === 'ACTIVE';
  const [choice, setChoice] = useState<StatusChoice>(isCurrentlyActive ? 'ACTIVE' : 'CLOSE');
  const [selectedReason, setSelectedReason] = useState<ClosureReason | null>(
    currentClosureReason ? (currentClosureReason as ClosureReason) : null
  );

  const { mutateAsync: closeAnnouncement, isPending: isClosing } = useCloseAnnouncement();
  const { mutateAsync: reopenAnnouncement, isPending: isReopening } = useReopenAnnouncement();
  const isPending = isClosing || isReopening;

  useEffect(() => {
    if (visible) {
      setChoice(isCurrentlyActive ? 'ACTIVE' : 'CLOSE');
      setSelectedReason(currentClosureReason ? (currentClosureReason as ClosureReason) : null);
    }
  }, [visible, isCurrentlyActive, currentClosureReason]);

  const toast = useToast();

  const canSave =
    (choice === 'ACTIVE' && !isCurrentlyActive) ||
    (choice === 'CLOSE' && isCurrentlyActive && selectedReason != null);

  const handleSave = async () => {
    if (!canSave || isPending) return;

    try {
      if (choice === 'CLOSE' && selectedReason) {
        await closeAnnouncement({ id: announcementId, closureReason: selectedReason });
        toast.success(
          t('announcement.my.change_status.close_success_title'),
          t('announcement.my.change_status.close_success_subtitle')
        );
      } else if (choice === 'ACTIVE') {
        await reopenAnnouncement(announcementId);
        toast.success(
          t('announcement.my.change_status.reopen_success_title'),
          t('announcement.my.change_status.reopen_success_subtitle')
        );
      }
      onStatusChanged();
    } catch {
      // error handled by mutation
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
          className="rounded-t-[24px] bg-white"
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
              {t('announcement.my.change_status.title')}
            </ThemedText>
            <ThemedText className="mt-2 w-[295px] text-center text-[13px] leading-[18px] text-neutral-500">
              {t('announcement.my.change_status.description')}
            </ThemedText>
          </View>

          {/* Radio options */}
          <View className="mx-4 mt-4 gap-0">
            {/* Active option */}
            <Pressable
              onPress={() => setChoice('ACTIVE')}
              className="flex-row items-center gap-3 py-4"
              accessibilityRole="radio"
              accessibilityState={{ checked: choice === 'ACTIVE' }}>
              <View
                className={cn(
                  'h-5 w-5 items-center justify-center rounded-full border',
                  choice === 'ACTIVE' ? 'border-primary' : 'border-neutral-300'
                )}>
                <View
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    choice === 'ACTIVE' ? 'bg-primary' : 'bg-transparent'
                  )}
                />
              </View>
              <ThemedText className="text-[16px] font-medium text-foreground">
                {t('announcement.my.change_status.active')}
              </ThemedText>
            </Pressable>

            {/* Close option */}
            <Pressable
              onPress={() => setChoice('CLOSE')}
              className="flex-row items-center gap-3 py-4"
              accessibilityRole="radio"
              accessibilityState={{ checked: choice === 'CLOSE' }}>
              <View
                className={cn(
                  'h-5 w-5 items-center justify-center rounded-full border',
                  choice === 'CLOSE' ? 'border-primary' : 'border-neutral-300'
                )}>
                <View
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    choice === 'CLOSE' ? 'bg-primary' : 'bg-transparent'
                  )}
                />
              </View>
              <ThemedText className="text-[16px] font-medium text-foreground">
                {t('announcement.my.change_status.close')}
              </ThemedText>
            </Pressable>
          </View>

          {/* Closure reason picker (shown when Close is selected) */}
          {choice === 'CLOSE' ? (
            <View className="mx-4 mt-4">
              <ThemedText className="mb-2 text-[14px] font-medium text-neutral-500">
                {t('announcement.my.select_reason')}
              </ThemedText>
              <View className="gap-0">
                {CLOSURE_REASONS.map((reason) => (
                  <Pressable
                    key={reason.value}
                    onPress={() => setSelectedReason(reason.value)}
                    className="flex-row items-center gap-3 py-3"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selectedReason === reason.value }}>
                    <View
                      className={cn(
                        'h-4 w-4 items-center justify-center rounded-full border',
                        selectedReason === reason.value
                          ? 'border-primary'
                          : 'border-neutral-300'
                      )}>
                      <View
                        className={cn(
                          'h-2 w-2 rounded-full',
                          selectedReason === reason.value ? 'bg-primary' : 'bg-transparent'
                        )}
                      />
                    </View>
                    <ThemedText className="text-[14px] text-foreground">
                      {t(reason.labelKey)}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {/* Save button */}
          <View
            className="mt-4 rounded-t-[12px] border-t border-neutral-50 bg-white px-4 pt-[14px]"
            style={[FOOTER_SHADOW, { paddingBottom: insets.bottom + 14 }]}>
            <Button onPress={handleSave} disabled={!canSave || isPending}>
              {isPending ? (
                <ActivityIndicator color="#666" />
              ) : (
                t('announcement.my.change_status.save')
              )}
            </Button>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
